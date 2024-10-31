'use client';
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyADhVCZgpjCw1EB4Nn-SptwiJdldPrIhjs",
  authDomain: "kimchi-premium-chat.firebaseapp.com",
  databaseURL: "https://kimchi-premium-chat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kimchi-premium-chat",
  storageBucket: "kimchi-premium-chat.appspot.com",
  messagingSenderId: "1048858398261",
  appId: "1:1048858398261:web:cbe445cc7ff6be52ec6b7c",
  measurementId: "G-94QCKLHTWV"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const adjectives = ['신나는', '행복한', '즐거운', '날쌘', '현명한', '귀여운', '용감한'];
    const nouns = ['비트코인', '이더리움', '도지코인', '리플', '폴카닷', '에이다'];
    const number = Math.floor(Math.random() * 1000);
    const newNickname = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${number}`;
    setNickname(newNickname);
  }, []);

useEffect(() => {
  if (isOpen && nickname) {
    const messagesRef = ref(database, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 최근 메시지 10개만 가져오기
        const messageList = Object.values(data)
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(-10); // 최신 10개만 슬라이스
        setMessages(messageList);
      }
    });

    return () => unsubscribe();
  }
}, [isOpen, nickname]);

// 추가 스크롤 효과 제거
useEffect(() => {
  if (messages.length > 0) {
    chatEndRef.current?.scrollIntoView({ behavior: 'instant' }); // 부드러운 스크롤 제거
  }
}, [messages]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !nickname) return;

    try {
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, {
        text: newMessage,
        nickname,
        timestamp: Date.now()
      });
      setNewMessage('');
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {nickname && (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-2 px-4 py-2 bg-yellow-400 text-black rounded-full shadow-lg hover:bg-yellow-500 transition-colors"
          >
            {isOpen ? '채팅창 닫기' : '실시간 채팅'}
          </button>

          {isOpen && (
            <div className="w-80 bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="p-4 bg-yellow-400 text-black rounded-t-lg flex justify-between items-center">
                <h3 className="font-semibold">김치프리미엄 채팅</h3>
                <span className="text-sm">({nickname})</span>
              </div>

              <div className="h-96 overflow-y-auto p-4 bg-gray-100">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-3 flex ${msg.nickname === nickname ? 'justify-end' : ''}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        msg.nickname === nickname
                          ? 'bg-yellow-300 text-black max-w-[80%] rounded-br-none'
                          : 'bg-white text-gray-800 max-w-[80%] rounded-bl-none'
                      }`}
                    >
                      <div className="text-xs text-gray-500">{msg.nickname}</div>
                      <div className="break-all text-sm">{msg.text}</div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSubmit} className="p-4 bg-gray-200 flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="메시지 입력..."
                  className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 transition-colors"
                >
                  전송
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}
