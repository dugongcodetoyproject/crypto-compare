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

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function Chat() {
 const [messages, setMessages] = useState([]);
 const [newMessage, setNewMessage] = useState('');
 const [nickname, setNickname] = useState('');
 const [isOpen, setIsOpen] = useState(true);
 const chatEndRef = useRef(null);

 // 컴포넌트 마운트 시 닉네임 생성
 useEffect(() => {
   const adjectives = ['신나는', '행복한', '즐거운', '날쌘', '현명한', '귀여운', '용감한'];
   const nouns = ['비트코인', '이더리움', '도지코인', '리플', '폴카닷', '에이다'];
   const number = Math.floor(Math.random() * 1000);
   const newNickname = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${number}`;
   setNickname(newNickname);
 }, []);

 useEffect(() => {
   if (isOpen && nickname) {  // nickname이 설정된 후에만 메시지 구독
     const messagesRef = ref(database, 'messages');
     const unsubscribe = onValue(messagesRef, (snapshot) => {
       console.log('새로운 데이터 수신:', snapshot.val());
       const data = snapshot.val();
       if (data) {
         const messageList = Object.values(data)
           .sort((a, b) => a.timestamp - b.timestamp)
           .slice(-100);
         console.log('처리된 메시지 리스트:', messageList);
         setMessages(messageList);
       }
     });

     return () => unsubscribe();
   }
 }, [isOpen, nickname]);

 useEffect(() => {
   chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages]);

 const handleSubmit = async (e) => {
   e.preventDefault();
   if (!newMessage.trim() || !nickname) return;

   try {
     console.log('메시지 전송 시도:', newMessage);
     const messagesRef = ref(database, 'messages');
     await push(messagesRef, {
       text: newMessage,
       nickname,
       timestamp: Date.now()
     });
     console.log('메시지 전송 성공');
     setNewMessage('');
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
           className="mb-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
         >
           {isOpen ? '채팅창 닫기' : '실시간 채팅'}
         </button>

         {isOpen && (
           <div className="w-80 bg-white rounded-lg shadow-xl">
             <div className="p-3 bg-blue-500 text-white rounded-t-lg flex justify-between items-center">
               <h3 className="font-semibold">실시간 채팅</h3>
               <span className="text-sm">({nickname})</span>
             </div>

             <div className="h-96 overflow-y-auto p-4 bg-gray-50">
               {messages.map((msg, index) => (
                 <div
                   key={index}
                   className={`mb-2 ${msg.nickname === nickname ? 'text-right' : ''}`}
                 >
                   <div
                     className={`inline-block max-w-[80%] px-3 py-2 rounded-lg ${
                       msg.nickname === nickname
                         ? 'bg-blue-500 text-white'
                         : 'bg-gray-200 text-gray-800'
                     }`}
                   >
                     <div className="text-xs opacity-75">{msg.nickname}</div>
                     <div className="break-all">{msg.text}</div>
                   </div>
                 </div>
               ))}
               <div ref={chatEndRef} />
             </div>

             <form onSubmit={handleSubmit} className="p-3 border-t">
               <div className="flex space-x-2">
                 <input
                   type="text"
                   value={newMessage}
                   onChange={(e) => setNewMessage(e.target.value)}
                   placeholder="메시지 입력..."
                   className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                 />
                 <button
                   type="submit"
                   className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                 >
                   전송
                 </button>
               </div>
             </form>
           </div>
         )}
       </>
     )}
   </div>
 );
}