"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Globe, Heart, MessageSquare, User, Clock, MapPin, 
  Send, ArrowLeft, Bot, Search, Utensils, Coffee, Laptop, Smile, Footprints, Bike, Bus, Share2, Lock, Mail, LogOut, CheckCircle2, ChevronRight, Bookmark, ShieldCheck, Trash2, Navigation, ExternalLink, Settings, Phone, Camera, Check, RefreshCw
} from 'lucide-react';

export default function LunchMateApp() {
  // Authentication State (MẬT KHẨU BAN ĐẦU ĐỂ TRỐNG)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState(''); // Để trống hoàn toàn
  const [loginError, setLoginError] = useState('');

  // Student Profile Data
  const [studentName, setStudentName] = useState('Khánh Vy');
  const [studentCohort, setStudentCohort] = useState('K52');
  const [studentFaculty, setStudentFaculty] = useState('Khoa Kinh Tế');
  const [studentPhone, setStudentPhone] = useState('0901 911 123');
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>(['Đồ Hàn', 'Trà trái cây']);
  const [allergies, setAllergies] = useState<string[]>(['Đậu phụng']);

  // Navigation & Subviews
  const [activeTab, setActiveTab] = useState('home');
  const [matchMode, setMatchMode] = useState<'duo' | 'group'>('duo');
  const [purpose, setPurpose] = useState('tam-chuyen');
  const [budget, setBudget] = useState('35k');
  const [selectedCampus, setSelectedCampus] = useState('Cơ sở A - Nguyễn Đình Chiểu (Q.3)');

  // Match 1-1 Flow States
  const [matchStep, setMatchStep] = useState<'filter' | 'swiping' | 'requesting' | 'success'>('filter');
  const [currentCandidateIdx, setCurrentCandidateIdx] = useState(0);

  // Profile Sub-views
  const [profileSubView, setProfileSubView] = useState<'main' | 'info' | 'taste' | 'saved' | 'settings'>('main');

  // Chat Sub-views
  const [chatSubView, setChatSubView] = useState<'menu' | 'group_chat' | 'direct_list' | 'direct_chat'>('menu');
  const [selectedDirectUser, setSelectedDirectUser] = useState<any>(null);

  // Explore & Map Modal
  const [selectedPlaceForNav, setSelectedPlaceForNav] = useState<any>(null);

  // System Data
  const campuses = [
    { id: 'A', name: 'Cơ sở A - Nguyễn Đình Chiểu (Q.3)', district: 'Q.3' },
    { id: 'B', name: 'Cơ sở B - Nguyễn Tri Phương (Q.10)', district: 'Q.10' },
    { id: 'C', name: 'Cơ sở C - 3 Tháng 2 (Q.10)', district: 'Q.10' },
    { id: 'N', name: 'Cơ sở N - Nguyễn Văn Linh (Bình Chánh)', district: 'Bình Chánh' },
    { id: 'H', name: 'Cơ sở H - Hoàng Văn Thụ (Phú Nhuận)', district: 'Phú Nhuận' }
  ];

  const candidateUsers = [
    {
      id: 1,
      name: 'Thảo Nhi',
      cohort: 'K49',
      faculty: 'Kinh tế',
      campus: 'Cơ sở A',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
      interests: ['Thèm mì xào bò căn tin B2', 'Thích vừa ăn vừa tám chuyện CLB', 'Gần đây đang ghiền Nhạc Indie'],
      club: 'CLB Bell UEH',
      languages: 'Tiếng Anh & Tiếng Việt',
      freeTime: '11:30 - 12:30 PM'
    },
    {
      id: 2,
      name: 'Gia Huy',
      cohort: 'K49',
      faculty: 'Tài chính',
      campus: 'Cơ sở N',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
      interests: ['Thèm Mì Cay Seoul', 'Fan cứng bóng đá UEH League', 'Gank game nhẹ trưa nay'],
      club: 'CLB Basketball UEH',
      languages: 'Tiếng Việt',
      freeTime: '11:30 - 12:30 PM'
    },
    {
      id: 3,
      name: 'Nhã Kỳ',
      cohort: 'K48',
      faculty: 'Marketing',
      campus: 'Cơ sở A',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      interests: ['Thèm ăn Sushi', 'Trà giải nhiệt', 'Thích vừa ăn vừa tám chuyện CLB'],
      club: 'CLB HR-Start Up UEH',
      languages: 'Tiếng Anh & Tiếng Việt',
      freeTime: '11:30 - 12:30 PM'
    }
  ];

  const allPlaces = [
    { 
      id: 1, 
      name: 'The Coffee House - Trần Cao Vân', 
      type: 'Cà phê & Deadline', 
      district: 'Q.3', 
      price: '35k', 
      address: 'The Coffee House Trần Cao Vân Quận 3',
      desc: 'Không gian rộng rãi, nhiều ổ cắm điện, wifi cực nhanh.',
      walk: 'Rẽ trái cổng CS A 100m, đi thẳng đường Trần Cao Vân 2 phút là tới.'
    },
    { 
      id: 2, 
      name: 'Cơm Tấm Ba Cường', 
      type: 'Cơm tấm', 
      district: 'Q.3', 
      price: '35k', 
      address: 'Cơm Tấm Ba Cường Nguyễn Đình Chiểu Quận 3',
      desc: 'Sườn nướng thơm phức, sát vách Cơ sở A.',
      walk: 'Từ cổng CS A rẽ phải 50m là tới quán.'
    },
    { 
      id: 3, 
      name: 'Highlands Coffee N2TP', 
      type: 'Cà phê & Deadline', 
      district: 'Q.10', 
      price: '35k', 
      address: 'Highlands Coffee Nguyễn Tri Phương Quận 10',
      desc: 'Đối diện CS B, máy lạnh mát rượi, chỗ ngồi cày bài nhóm.',
      walk: 'Băng qua vạch sang đường đối diện cổng CS B.'
    }
  ];

  // Chat States
  const [directMessages, setDirectMessages] = useState<any[]>([
    { id: 1, sender: 'Thảo Nhi', text: 'Hi Vy, 15p nữa gặp nhau ở căn tin B2 nhé!', isMe: false },
    { id: 2, sender: 'Vy', text: 'Chốt kèo! Mình sắp tới nơi rùi!!', isMe: true },
    { id: 3, sender: 'Thảo Nhi', text: 'Deal, hẹn gặp Vy nha! 💚', isMe: false }
  ]);
  const [directInput, setDirectInput] = useState('');
  const [isFriendTyping, setIsFriendTyping] = useState(false);

  // Group Messages
  const [groupMessages, setGroupMessages] = useState<any[]>([
    { id: 1, sender: 'Hoàng Nam', text: 'Mọi người ơi trưa nay ghé quán nào quanh CS A đây?', isMe: false },
    { id: 2, sender: 'LunchMate Bot', text: '🤖 Tớ gợi ý quán Cơm Tấm Ba Cường ngay sát cổng CS A nha!', isAi: true }
  ]);
  const [groupInput, setGroupInput] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentDistrict = campuses.find(c => c.name === selectedCampus)?.district || 'Q.3';

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanEmail.endsWith('@st.ueh.edu.vn')) {
      setLoginError('Vui lòng nhập đúng Email Sinh viên UEH (@st.ueh.edu.vn)!');
      return;
    }

    const username = cleanEmail.split('@')[0];
    const parts = username.split('.');
    let displayName = parts[0];
    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    setStudentName(displayName);
    setLoginError('');
    setIsLoggedIn(true);
  };

  // XỬ LÝ GỬI TIN NHẮN 1-1 VÀ NGƯỜI BẠN ĐÓ TRẢ LỜI THỰC SỰ
  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directInput.trim()) return;

    const userText = directInput;
    const friendName = selectedDirectUser?.name || 'Thảo Nhi';

    // Thêm tin nhắn của bạn vào khung chat
    setDirectMessages(prev => [...prev, { id: Date.now(), sender: studentName || 'Vy', text: userText, isMe: true }]);
    setDirectInput('');

    // Người bạn đó đang gõ...
    setIsFriendTyping(true);

    // Người bạn đó nhắn tin phản hồi thực sự (Không phải Bot AI)
    setTimeout(() => {
      let friendReply = `Oki nè ${studentName}! Hẹn gặp bạn ở chỗ hẹn nha ☺️`;
      const lower = userText.toLowerCase();

      if (lower.includes('chào') || lower.includes('hello') || lower.includes('hi')) {
        friendReply = `Hi ${studentName}! Bạn tới chưa nè? Mình đang ở bàn gần cửa nhé!`;
      } else if (lower.includes('món') || lower.includes('ăn') || lower.includes('quán')) {
        friendReply = `Món đó ngon á! Trưa nay tụi mình gọi ăn chung luôn nha 😉`;
      } else if (lower.includes('mấy giờ') || lower.includes('khi nào') || lower.includes('trễ')) {
        friendReply = `Tầm 5-10 phút nữa mình có mặt nè, bạn cứ thong thả nha!`;
      }

      setDirectMessages(prev => [...prev, { id: Date.now() + 1, sender: friendName, text: friendReply, isMe: false }]);
      setIsFriendTyping(false);
    }, 1200);
  };

  const handleLeaveAndClearGroup = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy cuộc hẹn và xóa nhóm trò chuyện này không?")) {
      setGroupMessages([]);
      setChatSubView('menu');
      setActiveTab('match');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [directMessages, groupMessages, isFriendTyping]);

  const currentCandidate = candidateUsers[currentCandidateIdx % candidateUsers.length];

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative pb-16 overflow-hidden">

        {/* HEADER BAR */}
        <header className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-md shadow-orange-500/20">
              12PM
            </div>
            <span className="font-bold text-slate-800 text-sm">LunchMate & Hangout</span>
          </div>
          {isLoggedIn && (
            <div className="flex items-center gap-2" onClick={() => { setActiveTab('profile'); setProfileSubView('main'); }}>
              <span className="text-[10px] font-bold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full border border-orange-100 cursor-pointer">
                {studentCohort} - UEH
              </span>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-7 h-7 rounded-full object-cover border border-orange-400 cursor-pointer" alt="Avatar" />
            </div>
          )}
        </header>

        {/* LOGIN SCREEN */}
        {!isLoggedIn ? (
          <div className="flex-1 p-6 flex flex-col justify-center space-y-6 bg-slate-50/50">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-xl mx-auto shadow-lg shadow-orange-500/30">
                12PM
              </div>
              <h1 className="text-xl font-black text-slate-800">12PM LunchMate & Hangout</h1>
              <p className="text-xs text-slate-500">Mỗi bữa trưa là một cuộc gặp gỡ</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-xs font-black text-slate-700 uppercase tracking-wide text-center">Giờ trưa vui hơn khi có bạn</h2>
              
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Student ID / UEH Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="vynguyen.31251022300@st.ueh.edu.vn"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 border border-slate-200"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Password (Để trống ban đầu)</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Mật khẩu tài khoản UEH"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 border border-slate-200"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {loginError && (
                <div className="p-2 bg-red-50 rounded-xl border border-red-100 text-[11px] font-bold text-red-600 text-center">
                  ⚠️ {loginError}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition"
              >
                Đăng nhập tài khoản UEH 🚀
              </button>
            </form>
          </div>
        ) : (
          <main className="flex-1 overflow-y-auto bg-slate-50/50">

            {/* TAB 1: TRANG CHỦ */}
            {activeTab === 'home' && (
              <div className="p-5 space-y-5">
                <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-3 shadow-lg relative overflow-hidden">
                  <div className="text-xs text-orange-400 font-bold uppercase tracking-wider">Ăn trưa cùng nhau nhé! 🍲</div>
                  <h1 className="text-2xl font-black">Xin chào {studentName}!</h1>
                  <p className="text-xs text-slate-300">Sẵn sàng lên kèo đi ăn & kết nối bạn mới hôm nay?</p>
                  
                  <button 
                    onClick={() => { setActiveTab('match'); setMatchStep('filter'); }}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/30 transition"
                  >
                    ⚡ Kết nối ngay
                  </button>
                </div>

                <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lời mời đã nhận được</span>
                  <div className="flex items-center justify-between p-3 bg-orange-50/60 rounded-2xl border border-orange-100">
                    <span className="text-xs font-bold text-slate-700">Chạm để ghép đôi 1-1</span>
                    <button 
                      onClick={() => { setActiveTab('match'); setMatchStep('swiping'); }}
                      className="px-3 py-1.5 bg-orange-500 text-white font-bold text-[10px] rounded-xl shadow-sm"
                    >
                      Ghép ngay
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-sm">Cùng ăn trưa nào!</h3>
                    <span className="text-[10px] font-bold text-orange-600">• 24 bạn online</span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                    {candidateUsers.map((u) => (
                      <div key={u.id} className="flex-none w-20 text-center space-y-1">
                        <img src={u.avatar} className="w-14 h-14 rounded-full object-cover mx-auto border-2 border-orange-400 p-0.5" alt={u.name} />
                        <div className="font-bold text-xs text-slate-800 truncate">{u.name}</div>
                        <div className="text-[9px] text-slate-400 font-semibold">{u.campus}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: KẾT NỐI (LUỒNG KẾT NỐI BẠN BÈ 1-1 CHUYÊN SÂU) */}
            {activeTab === 'match' && (
              <div className="p-5 space-y-5">
                {matchStep === 'filter' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h1 className="text-xl font-black text-slate-800">Tìm bạn ăn trưa</h1>
                        <p className="text-xs text-slate-500">Bụng đói rồi, tìm người cùng tần số thôi!</p>
                      </div>
                      <div className="flex bg-slate-200 p-1 rounded-xl text-[10px] font-bold">
                        <button onClick={() => setMatchMode('duo')} className={`px-2.5 py-1 rounded-lg ${matchMode === 'duo' ? 'bg-white text-orange-600' : 'text-slate-600'}`}>1-1</button>
                        <button onClick={() => setMatchMode('group')} className={`px-2.5 py-1 rounded-lg ${matchMode === 'group' ? 'bg-white text-orange-600' : 'text-slate-600'}`}>Nhóm</button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-800 uppercase">Khung giờ rảnh</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['11:00 - 11:30', '11:30 - 12:00', '12:00 - 12:30'].map((t, i) => (
                          <button key={i} className={`py-2 text-[10px] font-bold rounded-xl border ${i === 1 ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-slate-600 border-slate-200'}`}>{t}</button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-800 uppercase">Bạn tìm người ăn cùng để...</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'tam-chuyen', name: 'Tám chuyện', sub: 'Kết bạn mới, chia sẻ' },
                          { id: 'ngoai-ngu', name: 'Học ngoại ngữ', sub: 'Vừa ăn vừa luyện speaking' },
                          { id: 'deadline', name: 'Chạy deadline', sub: 'Vừa ăn vừa học' },
                          { id: 'mon-moi', name: 'Thử món mới', sub: 'Cùng đi săn quán hot' }
                        ].map((p) => (
                          <button 
                            key={p.id} 
                            onClick={() => setPurpose(p.id)} 
                            className={`p-3 rounded-2xl text-left border ${purpose === p.id ? 'bg-orange-50 border-orange-500 text-orange-700 font-bold' : 'bg-white border-slate-200 text-slate-600'}`}
                          >
                            <div className="text-xs">{p.name}</div>
                            <div className="text-[9px] text-slate-400">{p.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-800 uppercase">Địa điểm Campus</label>
                      <select 
                        value={selectedCampus}
                        onChange={(e) => setSelectedCampus(e.target.value)}
                        className="w-full text-xs font-bold p-3 bg-white border border-slate-200 rounded-2xl focus:outline-none"
                      >
                        {campuses.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={() => setMatchStep('swiping')} 
                      className="w-full py-3.5 bg-orange-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition"
                    >
                      Tìm kiếm bạn ăn trưa 🚀
                    </button>
                  </div>
                )}

                {/* BẮT SÓNG LƯỚT HỒ SƠ 1-1 */}
                {matchStep === 'swiping' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <button onClick={() => setMatchStep('filter')} className="p-1.5 bg-slate-200 rounded-xl">
                        <ArrowLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <span className="text-xs font-black text-slate-700">Gợi ý cạ cứng cho Vy</span>
                      <button onClick={() => setCurrentCandidateIdx(prev => prev + 1)} className="p-1.5 bg-slate-200 rounded-xl">
                        <RefreshCw className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden space-y-3 pb-4">
                      <div className="relative h-64">
                        <img src={currentCandidate.avatar} className="w-full h-full object-cover" alt={currentCandidate.name} />
                        <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/60 backdrop-blur-md rounded-2xl text-white">
                          <h2 className="font-black text-lg">{currentCandidate.name} <span className="text-xs font-normal text-orange-300">({currentCandidate.cohort})</span></h2>
                          <p className="text-[11px] text-slate-200">{currentCandidate.faculty} - {currentCandidate.campus}</p>
                        </div>
                      </div>

                      <div className="p-4 space-y-3 text-xs">
                        <div className="font-bold text-slate-800">✨ Bắt sóng với {currentCandidate.name}:</div>
                        <div className="space-y-1.5">
                          {currentCandidate.interests.map((item, idx) => (
                            <div key={idx} className="p-2 bg-orange-50/70 rounded-xl border border-orange-100 text-orange-900 text-[11px] font-medium flex items-center gap-1.5">
                              <span>💡</span> {item}
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-slate-50 rounded-2xl space-y-1 text-[11px]">
                          <div><strong>CLB sinh hoạt:</strong> {currentCandidate.club}</div>
                          <div><strong>Ngôn ngữ:</strong> {currentCandidate.languages}</div>
                          <div><strong>Rảnh hôm nay:</strong> <span className="text-orange-600 font-bold">{currentCandidate.freeTime}</span></div>
                        </div>

                        <button 
                          onClick={() => setMatchStep('requesting')}
                          className="w-full py-3.5 bg-orange-500 text-white font-black rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition flex items-center justify-center gap-2"
                        >
                          <Heart className="w-4 h-4 fill-white" /> Kết nối ngay
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ĐANG GỬI YÊU CẦU KẾT NỐI */}
                {matchStep === 'requesting' && (
                  <div className="py-12 text-center space-y-6">
                    <div className="relative w-28 h-28 mx-auto">
                      <img src={currentCandidate.avatar} className="w-full h-full rounded-full object-cover border-4 border-orange-500 animate-pulse" alt={currentCandidate.name} />
                      <div className="absolute -bottom-2 right-2 bg-orange-500 text-white p-1.5 rounded-full">
                        <Send className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-lg font-black text-slate-800">Đã gửi yêu cầu kết nối!</h2>
                      <p className="text-xs text-slate-500">Đang chờ {currentCandidate.name} phản hồi (Tự động hủy sau 10 phút)</p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 max-w-xs mx-auto text-left space-y-1 text-xs">
                      <div className="font-bold text-orange-800">📍 Kế hoạch cuộc hẹn:</div>
                      <div className="text-slate-600">Thời gian: 11:30 AM</div>
                      <div className="text-slate-600">Địa điểm: Căn tin B2 ({selectedCampus.split('-')[0]})</div>
                    </div>

                    <div className="flex gap-2 justify-center pt-4">
                      <button 
                        onClick={() => setMatchStep('success')} 
                        className="px-5 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md"
                      >
                        Đồng ý kết nối ✨
                      </button>
                    </div>
                  </div>
                )}

                {/* KẾT NỐI THÀNH CÔNG */}
                {matchStep === 'success' && (
                  <div className="py-8 text-center space-y-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-lg">
                    <div className="flex justify-center items-center gap-3">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" className="w-16 h-16 rounded-full object-cover border-2 border-orange-400" alt="Vy" />
                      <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-bounce" />
                      <img src={currentCandidate.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-orange-400" alt={currentCandidate.name} />
                    </div>

                    <div>
                      <h2 className="text-xl font-black text-slate-800">Kết nối thành công! 🎉</h2>
                      <p className="text-xs text-slate-500">Bạn và {currentCandidate.name} đã chốt kèo ăn trưa.</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl text-left text-xs space-y-1 border">
                      <div className="font-bold text-slate-700">📅 Lịch hẹn:</div>
                      <div>• Thời gian: 11:45 AM</div>
                      <div>• Địa điểm: Căn tin B2</div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedDirectUser(currentCandidate);
                        setActiveTab('chat');
                        setChatSubView('direct_chat');
                      }} 
                      className="w-full py-3.5 bg-orange-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Mở khung Chat 1-1 ngay 💬
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: KHÁM PHÁ (QUÁN ĂN & ĐƯỜNG ĐI MAPS) */}
            {activeTab === 'explore' && (
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 mb-0.5">
                    <Navigation className="w-3.5 h-3.5" /> Quán ngon gần: {selectedCampus.split('-')[0]} ({currentDistrict})
                  </div>
                  <h1 className="text-xl font-black text-slate-800">Hôm nay, ăn gì? 😋</h1>
                </div>

                <div className="space-y-3">
                  {allPlaces.map((place) => (
                    <div 
                      key={place.id} 
                      onClick={() => setSelectedPlaceForNav(place)}
                      className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2 hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-sm">{place.name}</h3>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg">{place.type}</span>
                      </div>
                      <p className="text-xs text-slate-500">{place.desc}</p>
                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className="font-bold text-orange-600">Khu vực: {place.district}</span>
                        <span className="font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> Đường đi ➔
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TIN NHẮN (TRÒ CHUYỆN 1-1 BẠN BÈ PHẢN HỒI THẬT & AI TRONG CHAT NHÓM) */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full min-h-[500px]">
                {chatSubView === 'menu' && (
                  <div className="p-5 space-y-4">
                    <h1 className="text-lg font-black text-slate-800">Hội thoại trò chuyện</h1>

                    <div 
                      onClick={() => setChatSubView('direct_list')} 
                      className="p-5 rounded-3xl bg-sky-50 border border-sky-100 space-y-2 cursor-pointer hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-sky-500 text-white rounded-2xl flex items-center justify-center font-bold">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm">TRÒ CHUYỆN CÁ NHÂN (1-1)</h3>
                          <p className="text-[11px] text-slate-500">Khung chat riêng giữa bạn và người bạn đã ghép đôi</p>
                        </div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setChatSubView('group_chat')} 
                      className="p-5 rounded-3xl bg-pink-50 border border-pink-100 space-y-2 cursor-pointer hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-500 text-white rounded-2xl flex items-center justify-center font-bold">
                          <Utensils className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-sm">TRÒ CHUYỆN NHÓM & BOT AI</h3>
                          <p className="text-[11px] text-slate-500">Kèo ăn đông người & trợ lý AI gợi ý quán</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DANH SÁCH BẠN BÈ CHAT 1-1 */}
                {chatSubView === 'direct_list' && (
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <button onClick={() => setChatSubView('menu')} className="p-1 hover:bg-slate-200 rounded-lg">
                        <ArrowLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <h2 className="font-black text-slate-800 text-sm">Trò chuyện cá nhân 1-1</h2>
                    </div>

                    {candidateUsers.map((u) => (
                      <div 
                        key={u.id}
                        onClick={() => { setSelectedDirectUser(u); setChatSubView('direct_chat'); }}
                        className="p-3.5 bg-white rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} className="w-11 h-11 rounded-full object-cover" alt="Avatar" />
                          <div>
                            <h4 className="font-bold text-xs text-slate-800">{u.name} ({u.cohort})</h4>
                            <p className="text-[10px] text-slate-400 truncate">Hẹn gặp Vy nha! 💚</p>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">11:16 AM</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* KHUNG CHAT 1-1 VỚI BẠN BÈ (CÓ PHẢN HỒI THỰC SỰ TỪ BẠN ĐÓ) */}
                {chatSubView === 'direct_chat' && (
                  <div className="flex flex-col h-[520px] bg-white">
                    <div className="p-3 border-b bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setChatSubView('direct_list')} className="p-1 hover:bg-slate-200 rounded-lg">
                            <ArrowLeft className="w-4 h-4 text-slate-600" />
                          </button>
                          <span className="font-bold text-xs text-slate-800">{selectedDirectUser?.name || 'Thảo Nhi'} ({selectedDirectUser?.cohort || 'K49'})</span>
                        </div>
                        <Phone className="w-4 h-4 text-slate-400" />
                      </div>

                      <div className="p-2.5 bg-orange-500 text-white rounded-2xl text-[11px] font-bold flex justify-between items-center shadow-sm">
                        <span>📅 Lịch hẹn: 11:30 AM - Căn tin B2</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px]">Còn 15 phút</span>
                      </div>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                      {directMessages.map((m) => (
                        <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[78%] p-3 rounded-2xl text-xs ${m.isMe ? 'bg-orange-500 text-white rounded-tr-none' : 'bg-white border text-slate-800 rounded-tl-none'}`}>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      {isFriendTyping && (
                        <div className="text-[10px] text-slate-400 italic">
                          {selectedDirectUser?.name || 'Thảo Nhi'} đang gõ tin nhắn...
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendDirectMessage} className="p-3 border-t bg-white flex gap-2">
                      <input 
                        type="text" 
                        placeholder={`Nhắn tin trực tiếp với ${selectedDirectUser?.name || 'bạn'}...`} 
                        value={directInput} 
                        onChange={(e) => setDirectInput(e.target.value)} 
                        className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-800 focus:outline-none" 
                      />
                      <button type="submit" className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {/* KHUNG CHAT NHÓM & AI BOT */}
                {chatSubView === 'group_chat' && (
                  <div className="flex flex-col h-[520px] bg-white">
                    <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setChatSubView('menu')} className="p-1 hover:bg-slate-200 rounded-lg">
                          <ArrowLeft className="w-4 h-4 text-slate-600" />
                        </button>
                        <h3 className="text-xs font-bold text-slate-800">Nhóm Ăn Trưa UEH</h3>
                      </div>
                      <button 
                        onClick={handleLeaveAndClearGroup}
                        className="text-[10px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" /> Hủy hẹn
                      </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                      {groupMessages.map((m) => (
                        <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${m.isMe ? 'bg-orange-500 text-white' : m.isAi ? 'bg-purple-100 text-purple-900 border' : 'bg-white border text-slate-800'}`}>
                            <div className="text-[9px] text-slate-400 font-bold mb-0.5">{m.sender}</div>
                            {m.text}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if(!groupInput.trim()) return;
                        setGroupMessages(prev => [...prev, { id: Date.now(), sender: studentName || 'Vy', text: groupInput, isMe: true }]);
                        setGroupInput('');
                      }} 
                      className="p-3 border-t bg-white flex gap-2"
                    >
                      <input 
                        type="text" 
                        placeholder="Nhắn vào nhóm..." 
                        value={groupInput} 
                        onChange={(e) => setGroupInput(e.target.value)} 
                        className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-800 focus:outline-none" 
                      />
                      <button type="submit" className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: CÁ NHÂN */}
            {activeTab === 'profile' && (
              <div className="p-5 space-y-5">
                {profileSubView === 'main' && (
                  <div className="space-y-5">
                    <div className="text-center space-y-2 pt-2">
                      <div className="relative w-20 h-20 mx-auto">
                        <img 
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                          alt="Avatar Sinh viên" 
                          className="w-full h-full rounded-full object-cover border-2 border-orange-400 shadow-sm"
                        />
                        <button className="absolute bottom-0 right-0 p-1.5 bg-orange-500 text-white rounded-full">
                          <Camera className="w-3 h-3" />
                        </button>
                      </div>
                      <div>
                        <h2 className="font-extrabold text-slate-800 text-xl">{studentName}</h2>
                        <p className="text-xs text-slate-400 font-medium">{studentCohort} - {studentFaculty}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div 
                        onClick={() => setProfileSubView('info')}
                        className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs">Thông tin cá nhân</h4>
                            <p className="text-[10px] text-slate-400">Hồ sơ sinh viên & liên hệ</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>

                      <div 
                        onClick={() => setProfileSubView('taste')}
                        className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                            <Utensils className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs">Sở thích ăn uống</h4>
                            <p className="text-[10px] text-slate-400">Gu ăn uống & Dị ứng của bạn</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>

                      <div 
                        onClick={() => setProfileSubView('settings')}
                        className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center">
                            <Settings className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs">Cài đặt & Bảo mật</h4>
                            <p className="text-[10px] text-slate-400">Quyền riêng tư & Đăng xuất</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* THÔNG TIN CÁ NHÂN CHI TIẾT */}
                {profileSubView === 'info' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setProfileSubView('main')} className="p-1 hover:bg-slate-200 rounded-lg">
                        <ArrowLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <h2 className="font-black text-slate-800 text-sm">Thông tin cá nhân</h2>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-500">Họ tên sinh viên</label>
                        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-800" />
                      </div>

                      <div>
                        <label className="font-bold text-slate-500">Khoa đang học</label>
                        <input type="text" value={studentFaculty} onChange={(e) => setStudentFaculty(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-800" />
                      </div>

                      <div>
                        <label className="font-bold text-slate-500">Số điện thoại</label>
                        <input type="text" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 border rounded-xl font-bold text-slate-800" />
                      </div>

                      <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-[11px] text-blue-900 font-medium">
                        ✓ {studentCohort} - Cơ sở A - UEH đã xác minh qua Mail sinh viên
                      </div>

                      <button onClick={() => setProfileSubView('main')} className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl shadow-sm">
                        Lưu thay đổi ✨
                      </button>
                    </div>
                  </div>
                )}

                {/* SỞ THÍCH ĂN UỐNG & DỊ ỨNG */}
                {profileSubView === 'taste' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setProfileSubView('main')} className="p-1 hover:bg-slate-200 rounded-lg">
                        <ArrowLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <h2 className="font-black text-slate-800 text-sm">Gu ăn uống của {studentName}</h2>
                    </div>

                    <div className="bg-white p-5 rounded-3xl border space-y-4 text-xs">
                      <div>
                        <h4 className="font-black text-slate-800 mb-2">🥢 Món hợp gu</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['Đồ Hàn', 'Trà trái cây', 'Cơm tấm', 'Món chay', 'Bún bò', 'Bánh mì'].map((item) => (
                            <button 
                              key={item} 
                              onClick={() => {
                                if(favoriteFoods.includes(item)) setFavoriteFoods(favoriteFoods.filter(i => i !== item));
                                else setFavoriteFoods([...favoriteFoods, item]);
                              }}
                              className={`p-2.5 rounded-xl border font-bold text-center ${favoriteFoods.includes(item) ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-black text-slate-800 mb-2">⚠️ Dị ứng & Lưu ý</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {['Đậu phụng', 'Hải sản', 'Sữa', 'Trứng', 'Hành'].map((item) => (
                            <button 
                              key={item} 
                              onClick={() => {
                                if(allergies.includes(item)) setAllergies(allergies.filter(i => i !== item));
                                else setAllergies([...allergies, item]);
                              }}
                              className={`p-2 rounded-xl border text-[11px] font-bold ${allergies.includes(item) ? 'bg-red-500 text-white border-red-500' : 'bg-slate-50 border-slate-200 text-slate-600'}`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button onClick={() => setProfileSubView('main')} className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl shadow-sm">
                        Lưu sở thích
                      </button>
                    </div>
                  </div>
                )}

                {/* CÀI ĐẶT & BẢO MẬT BÊN TRONG */}
                {profileSubView === 'settings' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setProfileSubView('main')} className="p-1 hover:bg-slate-200 rounded-lg">
                        <ArrowLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <h2 className="font-black text-slate-800 text-sm">Cài đặt & Bảo mật</h2>
                    </div>

                    <div className="bg-white p-4 rounded-3xl border space-y-3 text-xs">
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <div className="font-bold text-slate-800">Đăng nhập Face ID</div>
                          <div className="text-[10px] text-slate-400">Xác thực nhanh thiết bị này</div>
                        </div>
                        <input type="checkbox" defaultChecked />
                      </div>

                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <div className="font-bold text-slate-800">Hiển thị trạng thái hoạt động</div>
                          <div className="text-[10px] text-slate-400">Cho bạn bè biết khi bạn online</div>
                        </div>
                        <input type="checkbox" defaultChecked />
                      </div>

                      <button 
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full py-3 mt-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl border border-red-100 flex items-center justify-center gap-2 transition"
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất tài khoản
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        )}

        {/* BOTTOM NAVIGATION BAR */}
        {isLoggedIn && (
          <nav className="bg-slate-900 px-3 py-2 flex justify-between items-center text-white sticky bottom-0 z-20">
            {[
              { id: 'home', label: 'Trang chủ', icon: Home },
              { id: 'match', label: 'Kết nối', icon: Globe },
              { id: 'explore', label: 'Khám phá', icon: Heart },
              { id: 'chat', label: 'Tin nhắn', icon: MessageSquare },
              { id: 'profile', label: 'Cá nhân', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === 'chat') setChatSubView('menu');
                    if (tab.id === 'profile') setProfileSubView('main');
                  }}
                  className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                    isActive ? 'bg-sky-200 text-slate-900 font-bold scale-105' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[9px]">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* MODAL MỞ ĐƯỜNG ĐI TRỰC TIẾP TRÊN GOOGLE MAPS */}
        {selectedPlaceForNav && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-md rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom">
              <div className="flex justify-between items-center border-b pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{selectedPlaceForNav.name}</h3>
                  <p className="text-[11px] text-orange-600 font-bold">{selectedPlaceForNav.type} ({selectedPlaceForNav.district})</p>
                </div>
                <button onClick={() => setSelectedPlaceForNav(null)} className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">✕</button>
              </div>

              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlaceForNav.address || selectedPlaceForNav.name)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-3 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-2xl border border-sky-200 flex items-center justify-center gap-2 transition no-underline text-center"
              >
                <ExternalLink className="w-4 h-4" /> Mở vị trí trên Google Maps 🗺️
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}