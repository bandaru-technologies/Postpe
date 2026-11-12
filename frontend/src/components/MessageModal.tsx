import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Send, MessageSquare } from 'lucide-react'
import { messageService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import type { Post } from '../types'
import toast from 'react-hot-toast'

interface MessageModalProps {
  post: Post
  open: boolean
  onOpenChange: (open: boolean) => void
}

const QUICK_MESSAGES = [
  'Is this still available?',
  'Can you lower the price?',
  'I am interested. Please contact me.',
  'Can I see it in person?',
]

export default function MessageModal({ post, open, onOpenChange }: MessageModalProps) {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }
    if (user?.id === post.user.id) {
      toast.error('You cannot message yourself')
      return
    }
    setSending(true)
    try {
      await messageService.sendMessage({
        receiverId: post.user.id,
        postId: post.id,
        content: message.trim(),
      })
      toast.success('Message sent!')
      onOpenChange(false)
      setMessage('')
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-slide-up">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-bold text-white">Contact Seller</Dialog.Title>
                  <p className="text-xs text-gray-400">{post.user.name}</p>
                </div>
              </div>
              <Dialog.Close asChild>
                <button className="w-8 h-8 rounded-full hover:bg-navy-600 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Post preview */}
            <div className="flex gap-3 p-3 bg-navy-800 rounded-lg mb-4">
              {post.images?.[0] && (
                <img
                  src={post.images[0].url}
                  alt={post.title}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{post.title}</p>
                <p className="text-accent font-bold text-sm mt-0.5">
                  {post.price === 0 ? 'Free' : `₹${post.price.toLocaleString('en-IN')}`}
                </p>
                <p className="text-xs text-gray-400">{post.city}</p>
              </div>
            </div>

            {/* Quick messages */}
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_MESSAGES.map((q) => (
                <button
                  key={q}
                  onClick={() => setMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-navy-500 text-gray-300 hover:border-accent hover:text-accent transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Message input */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              rows={4}
              className="input resize-none mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSend()
              }}
            />

            <div className="flex gap-3">
              <Dialog.Close asChild>
                <button className="btn-secondary flex-1">Cancel</button>
              </Dialog.Close>
              <button
                onClick={handleSend}
                disabled={sending || !message.trim()}
                className="btn-primary flex-1"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
