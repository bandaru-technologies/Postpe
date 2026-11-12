import { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, ArrowLeft, BadgeCheck, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { messageService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { formatDate, cn } from '../lib/utils'
import type { Conversation, Message } from '../types'

export default function MessagesPage() {
  const { user } = useAuth()
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [mobileShowChat, setMobileShowChat] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Conversations with polling
  const { data: conversations = [], isLoading: convsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: messageService.getConversations,
    refetchInterval: 10000,
  })

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConv) return
    setMessagesLoading(true)
    messageService
      .getMessages(activeConv.id)
      .then(setMessages)
      .finally(() => setMessagesLoading(false))
    messageService.markRead(activeConv.id).catch(() => {/* ignore */})
  }, [activeConv?.id])

  // Poll messages every 5s
  useEffect(() => {
    if (!activeConv) return
    const interval = setInterval(async () => {
      const msgs = await messageService.getMessages(activeConv.id)
      setMessages(msgs)
    }, 5000)
    return () => clearInterval(interval)
  }, [activeConv?.id])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!text.trim() || !activeConv || sending) return
    const content = text.trim()
    setText('')
    setSending(true)
    try {
      const msg = await messageService.sendMessage({
        receiverId: activeConv.otherUser.id,
        postId: activeConv.post.id,
        content,
      })
      setMessages((prev) => [...prev, msg])
    } catch {
      toast.error('Failed to send message')
      setText(content)
    } finally {
      setSending(false)
    }
  }

  const selectConv = (conv: Conversation) => {
    setActiveConv(conv)
    setMobileShowChat(true)
    setMessages([])
  }

  return (
    <div className="min-h-screen bg-page-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>

        <div className="card overflow-hidden flex" style={{ height: 'calc(100vh - 12rem)' }}>
          {/* Conversations list */}
          <div className={cn(
            'w-full md:w-80 border-r border-navy-600 flex flex-col flex-shrink-0',
            mobileShowChat ? 'hidden md:flex' : 'flex',
          )}>
            <div className="p-4 border-b border-navy-600">
              <h2 className="text-sm font-semibold text-gray-300">
                {conversations.length} Conversation{conversations.length !== 1 ? 's' : ''}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {convsLoading ? (
                <div className="space-y-2 p-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 skeleton rounded-lg" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No messages yet</p>
                  <p className="text-gray-500 text-sm mt-1">When you contact a seller, it'll appear here</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConv(conv)}
                    className={cn(
                      'w-full text-left p-4 border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors',
                      activeConv?.id === conv.id && 'bg-navy-700/50 border-l-2 border-l-accent',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {conv.otherUser.avatarUrl ? (
                        <img src={conv.otherUser.avatarUrl} alt={conv.otherUser.name}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-navy-600 flex items-center justify-center text-accent font-bold flex-shrink-0">
                          {conv.otherUser.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="text-sm font-semibold text-white truncate">{conv.otherUser.name}</span>
                            {conv.otherUser.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-accent text-navy-900 text-xs font-bold flex items-center justify-center flex-shrink-0 ml-1">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-accent truncate mb-0.5">{conv.post?.title}</p>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage?.content}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={cn(
            'flex-1 flex flex-col min-w-0',
            !mobileShowChat ? 'hidden md:flex' : 'flex',
          )}>
            {activeConv ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-navy-600 flex items-center gap-3 bg-navy-800/50">
                  <button onClick={() => setMobileShowChat(false)} className="md:hidden text-gray-400 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {activeConv.otherUser.avatarUrl ? (
                    <img src={activeConv.otherUser.avatarUrl} alt={activeConv.otherUser.name}
                      className="w-9 h-9 rounded-full object-cover border border-accent/30" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-navy-600 flex items-center justify-center text-accent font-bold text-sm">
                      {activeConv.otherUser.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-white text-sm">{activeConv.otherUser.name}</p>
                      {activeConv.otherUser.verified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-xs text-gray-400 truncate">Re: {activeConv.post?.title}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="w-6 h-6 text-accent animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">No messages yet. Say hello!</div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender.id === user?.id
                      return (
                        <div key={msg.id} className={cn('flex gap-2', isMe ? 'justify-end' : 'justify-start')}>
                          {!isMe && (
                            <div className="w-7 h-7 rounded-full bg-navy-600 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0 mt-auto">
                              {msg.sender.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className={cn(
                            'max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm shadow-sm',
                            isMe
                              ? 'bg-accent text-navy-900 rounded-br-sm font-medium'
                              : 'bg-navy-700 text-white rounded-bl-sm border border-navy-600',
                          )}>
                            <p className="leading-relaxed">{msg.content}</p>
                            <p className={cn('text-xs mt-1 opacity-70', isMe ? '' : 'text-gray-400')}>
                              {formatDate(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-navy-600 bg-navy-800/30">
                  <div className="flex gap-3">
                    <input
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                      placeholder="Type a message..."
                      className="input flex-1"
                      disabled={sending}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!text.trim() || sending}
                      className="btn-primary px-4 py-2 flex-shrink-0"
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send</p>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="w-24 h-24 rounded-full bg-navy-800 flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-gray-600" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">Your Messages</h3>
                  <p className="text-gray-400 text-sm max-w-xs">
                    Select a conversation from the left panel to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
