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


// 유치한 가짜 메시지 목록 50개
const fakeMessages = [
  { text: "비트코인 가즈아!!", nickname: "신나는비트코인123", timestamp: Date.now() - 60000 },
  { text: "오늘은 상승장 가는 거 맞죠?", nickname: "행복한도지코인456", timestamp: Date.now() - 59000 },
  { text: "하락은 무섭지만 이 또한 투자...", nickname: "용감한리플789", timestamp: Date.now() - 58000 },
  { text: "비트야 나의 퇴직금을 부탁해...", nickname: "즐거운이더리움101", timestamp: Date.now() - 57000 },
  { text: "지금이라도 올라타야 하나요? 😆", nickname: "날쌘폴카닷202", timestamp: Date.now() - 56000 },
  { text: "모두 손 모아 기도해요", nickname: "귀여운에이다303", timestamp: Date.now() - 55000 },
  { text: "비트야… 넌 할 수 있어", nickname: "희망찬도지코인404", timestamp: Date.now() - 54000 },
  { text: "가즈아아아아아~~~", nickname: "즐거운비트코인505", timestamp: Date.now() - 53000 },
  { text: "오늘도 존버합니다 🕰️", nickname: "참을성있는리플707", timestamp: Date.now() - 52000 },
  { text: "그만 좀 떨어지자... 제발", nickname: "용기있는이더리움999", timestamp: Date.now() - 51000 },
  { text: "이번에 오르면 떡상각?", nickname: "날아라폴카닷404", timestamp: Date.now() - 50000 },
  { text: "내 코인 어쩌다 이 지경인가...", nickname: "절망의에이다111", timestamp: Date.now() - 49000 },
  { text: "여윳돈 있으면 더 넣어볼까?", nickname: "희망의도지코인222", timestamp: Date.now() - 48000 },
  { text: "비트코인아, 사랑한다", nickname: "사랑하는비트코인333", timestamp: Date.now() - 47000 },
  { text: "오늘도 수익률 확인 중...", nickname: "탐욕스런리플444", timestamp: Date.now() - 46000 },
  { text: "떡락할 때도 기분 좋게 웃어보자!", nickname: "유쾌한이더리움555", timestamp: Date.now() - 45000 },
  { text: "조금만 더 오르자, 비트야", nickname: "성장하는폴카닷666", timestamp: Date.now() - 44000 },
  { text: "곧 달에 도착할 듯?! 🌕", nickname: "우주가는비트코인777", timestamp: Date.now() - 43000 },
  { text: "하락장엔 고요함이 최고죠...", nickname: "조용한도지코인888", timestamp: Date.now() - 42000 },
  { text: "오늘 저녁에 비트 떡상 파티?", nickname: "파티하는리플999", timestamp: Date.now() - 41000 },
  { text: "출근 전 코인 확인은 필수!", nickname: "부지런한이더리움101", timestamp: Date.now() - 40000 },
  { text: "떡락이 무섭긴 하지만 버텨봅니다", nickname: "의지의폴카닷202", timestamp: Date.now() - 39000 },
  { text: "달까지 가는 중인가요?", nickname: "하늘나는비트코인303", timestamp: Date.now() - 38000 },
  { text: "벌써 세 번째 리셋...", nickname: "끈질긴리플404", timestamp: Date.now() - 37000 },
  { text: "비트야, 한 번만 도와줘!", nickname: "간절한도지코인505", timestamp: Date.now() - 36000 },
  { text: "오늘은 좀 오르자!", nickname: "희망찬에이다606", timestamp: Date.now() - 35000 },
  { text: "비트코인 가즈아!!", nickname: "신나는비트코인123" },
  { text: "오늘은 상승장 가는 거 맞죠?", nickname: "행복한도지코인456" },
  { text: "하락은 무섭지만 이 또한 투자...", nickname: "용감한리플789" },
  { text: "비트야 나의 퇴직금을 부탁해...", nickname: "즐거운이더리움101" },
  { text: "조금만 더 오르자, 비트야", nickname: "성장하는폴카닷666" },
  { text: "떨어지지 마라... 오늘은 오르자", nickname: "기도하는비트코인202" },
  { text: "오늘 저녁엔 비트 파티할까요?", nickname: "파티도지코인303" },
  { text: "내일 또 오를까요?", nickname: "기대하는리플404" },
  { text: "그만 떨어지고 올라라 제발", nickname: "용기있는에이다505" },
  { text: "코인은 사랑이다", nickname: "사랑하는비트코인606" },
  { text: "오늘도 수익률 확인 중", nickname: "탐욕스런도지707" },
  { text: "매일 떡락이다... 웃어보자", nickname: "유쾌한리플808" },
  { text: "혹시 이거 내가 잘못 투자한거?", nickname: "궁금한비트코인909" },
  { text: "제발 떡상 좀", nickname: "희망의이더리움1010" },
  { text: "비트코인! 힘내라!", nickname: "응원하는도지1111" },
  { text: "이번 달 용돈 다 쏟아 부었다", nickname: "절박한리플1212" },
  { text: "비트야... 어서 달까지 가자", nickname: "하늘나는폴카닷1313" },
  { text: "누구 코인 떡상 기도하나요?", nickname: "기도하는에이다1414" },
  { text: "하락 중이라니...", nickname: "걱정되는도지코인1515" },
  { text: "한 번만 더 오르면 좋겠는데", nickname: "한방노리는리플1616" },
  { text: "투자는 진짜 멘탈 싸움이야", nickname: "멘탈강한비트1717" },
  { text: "내일 오르길 빌어요", nickname: "희망찬에이다1818" },
  { text: "도대체 어디로 가는 걸까?", nickname: "방향잃은도지코인1919" },
  { text: "나만 코인 잘못 샀나?", nickname: "의심하는리플2020" },
  { text: "비트야, 진짜 갈 길이 머네", nickname: "길가늠하는폴카닷2121" },
  { text: "다들 투자 중인가요?", nickname: "호기심많은비트코인2222" },
  { text: "여윳돈 있다면 지금이 기회?", nickname: "기회잡는도지2323" },
  { text: "오늘도 어김없이 코인 확인 중", nickname: "열정리플2424" },
  { text: "언제쯤 떡상이 올까요?", nickname: "기대감상한폴카닷2525" },
  { text: "혹시 오를 때 팔아야 하나?", nickname: "현명한비트2626" },
  { text: "내일도 오르길 바랄게요", nickname: "행운을빈다도지2727" },
  { text: "매일 확인하느라 지친다", nickname: "지친리플2828" },
  { text: "가끔씩 너무 무섭다", nickname: "두려운에이다2929" },
  { text: "비트야 화이팅!", nickname: "비트응원하는도지3030" },
  { text: "나는 코인 투자로 자산을 늘리고 싶다", nickname: "꿈꾸는리플3131" },
  { text: "하루 종일 떡상 기다립니다", nickname: "기다리는폴카닷3232" },
  { text: "언제까지 존버해야 할까?", nickname: "버티는도지3333" },
  { text: "도대체 언제 오르려나", nickname: "답답한리플3434" },
  { text: "조금씩 오른다... 희망있다", nickname: "희망생긴에이다3535" },
  { text: "떡상 좀 하면 좋겠다", nickname: "욕심많은비트3636" },
  { text: "비트야~ 사랑한다", nickname: "애정하는도지3737" },
  { text: "이렇게 힘들게 가는 건가", nickname: "고민많은리플3838" },
  { text: "이번엔 진짜 상승? 믿어도 돼?", nickname: "신중한폴카닷3939" },
  { text: "코인 초보인데 떡상 기원 중", nickname: "초보의비트4040" },
  { text: "하락할 때마다 가슴이 철렁...", nickname: "긴장된도지4141" },
  { text: "언제쯤 맘 편히 볼 수 있을까", nickname: "고요한리플4242" },
  { text: "이거 잘못 산거 아닌가 싶다", nickname: "의심하는에이다4343" },
  { text: "오늘도 투자의 날이 밝았습니다", nickname: "긍정적비트4444" },
  { text: "살까 말까 고민 중...", nickname: "망설이는도지4545" },
  { text: "이번 주에라도 오르길!", nickname: "기대하는리플4646" },
  { text: "비트야! 달까지 가자!", nickname: "갈망하는폴카닷4747" },
  { text: "오늘은 괜히 샀나?", nickname: "후회하는에이다4848" },
  { text: "떡상 기운 받아서 떡상!", nickname: "기운받는도지4949" },
  { text: "코인, 나에게 상처를 주지마", nickname: "상처받은리플5050" },
  { text: "떡상하는 날이 오겠죠?", nickname: "기다리는에이다5151" },
  { text: "오늘도 비트코인 확인 중", nickname: "습관된비트5252" },
  { text: "한 번에 오르지 않는 코인", nickname: "느긋한도지5353" },
  { text: "하락장도 언젠간 지나가겠죠", nickname: "낙관적인리플5454" },
  { text: "조금씩 사면서 버텨야지", nickname: "성실한폴카닷5555" },
  { text: "제발 오늘은 오르자", nickname: "기대감만큼에이다5656" },
  { text: "내 코인, 언제쯤 빛날까", nickname: "아직은도지5757" },
  { text: "오늘도 코인 파도 타기 중", nickname: "파도타기비트5858" },
  { text: "지금이 사는 타이밍인가?", nickname: "기회노리는리플5959" },
  { text: "조금 더 오르면 만족할텐데", nickname: "기대감폴카닷6060" },
  { text: "내일도 기대해봐야지", nickname: "내일을기다리는에이다6161" },
  { text: "비트코인 떡상 기원합니다", nickname: "기도하는도지6262" },
  { text: "어제보다 나아졌나?", nickname: "변화를기다리는리플6363" },
  { text: "이번 주는 존버 주간", nickname: "버티는폴카닷6464" },
  { text: "오늘도 살까 말까 고민 중", nickname: "망설이는비트6565" },
  { text: "이게 진짜 투자하는 건가?", nickname: "현실감있는도지6666" },
  { text: "우리는 떡상할 운명", nickname: "믿음의리플6767" },
  { text: "조금씩 상승 중이라니 희망적", nickname: "희망적인폴카닷6868" },
  { text: "이 떡상, 진짜일까?", nickname: "궁금한에이다6969" },
  { text: "오늘은 진짜 잘될 것 같은데", nickname: "느낌있는도지7070" },
  { text: "모두들 존버합시다", nickname: "힘내는리플7171" },
  { text: "코인아, 내 전재산이 걸려있다", nickname: "모험가폴카닷7272" },
  { text: "비트야 사랑해... 제발", nickname: "애절한비트7373" },
  { text: "투자는 진짜 가슴 졸이는 일이네", nickname: "냉정한도지7474" },
  { text: "떡상 기운은 어딨나?", nickname: "떡상기다리는리플7575" },
  { text: "한 번의 기회를 기다린다", nickname: "신중한에이다7676" },
  { text: "가즈아!! 오늘의 떡상", nickname: "기대에찬비트7777" },
  { text: "손모아서 기도합니다", nickname: "절실한도지7878" },
  { text: "이제 진짜 오르지 않겠어?", nickname: "의심많은리플7979" },
  { text: "오늘도 떡상 기원 중", nickname: "희망찬폴카닷8080" },
  { text: "코인아, 나의 꿈을 이뤄줘", nickname: "꿈꾸는비트8181" },
  { text: "일단 사자... 그 후는 나중에 생각", nickname: "결단의도지8282" },
  { text: "떡락에 멘탈이 흔들린다", nickname: "동요하는리플8383" },
  { text: "내일도 확인해볼게", nickname: "긍정적인폴카닷8484" },
  { text: "오늘도 코인 분석 중", nickname: "분석하는비트8585" },
  { text: "제발 이번에는 제발!", nickname: "절박한도지8686" },
  { text: "떡상? 그거 다 꿈인가", nickname: "현실적인리플8787" },
  { text: "비트야 가즈아", nickname: "기다리는에이다8888" },
  { text: "이번 달은 좀 다르길...", nickname: "달라지길바라는비트8989" },
  { text: "코인은 결국 빛날 것이다", nickname: "긍정적인도지9090" },
  { text: "매일매일 확인 중", nickname: "집요한리플9191" },
  { text: "오늘도 떡상 기원하며...", nickname: "기도하는폴카닷9292" },
  { text: "언제쯤 맘 편히 투자할 수 있을까", nickname: "기다림에지친비트9393" },
  { text: "코인이 오르긴 오르네", nickname: "희망느끼는도지9494" },
  { text: "오늘은 진짜 오를까?", nickname: "기대하는리플9595" },
  { text: "코인이 점점 재미있어진다", nickname: "흥미로운에이다9696" },
  { text: "오늘은 손해 안 봤으면...", nickname: "신중한폴카닷9797" },
  { text: "비트야 내가 널 믿는다", nickname: "신뢰의비트9898" },
  { text: "이거 진짜 사야하나?", nickname: "망설이는도지9999" },
];



const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

export default function Chat() {
  const [messages, setMessages] = useState([...fakeMessages.slice(0, 5)]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const chatEndRef = useRef(null);

  // 가짜 메시지 생성 및 추가
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        const randomMessage = {
          ...fakeMessages[Math.floor(Math.random() * fakeMessages.length)],
          timestamp: Date.now(),
        };
        setMessages((prevMessages) => [...prevMessages, randomMessage].slice(-10)); // 최신 10개 유지
      }, 25000); // 5초마다 새로운 가짜 메시지 추가

      return () => clearInterval(interval); // 채팅창이 닫힐 때 정리
    }
  }, [isOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, {
        text: newMessage,
        nickname: "사용자",
        timestamp: Date.now()
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: newMessage, nickname: "사용자", timestamp: Date.now() }
      ].slice(-10)); // 최신 10개 유지
      setNewMessage('');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
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
            </div>

            <div className="h-96 overflow-y-auto p-4 bg-gray-100">
              {messages.map((msg, index) => (
                <div key={index} className="mb-3 flex justify-start">
                  <div className="px-4 py-2 rounded-2xl bg-white text-gray-800 max-w-[80%] rounded-bl-none">
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
    </div>
  );
}