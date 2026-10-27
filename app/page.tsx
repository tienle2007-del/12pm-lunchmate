"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Globe, Heart, MessageSquare, User, Clock, MapPin, 
  Send, ArrowLeft, Bot, Search, Utensils, Coffee, Laptop, Smile, Footprints, Bike, Bus, Share2, Lock, Mail, LogOut, CheckCircle2, ChevronRight, Bookmark, ShieldCheck, Trash2, Navigation, ExternalLink, Settings, Phone, Camera, Check, RefreshCw, Users, Star, SlidersHorizontal, Trees
} from 'lucide-react';

export default function LunchMateApp() {
  // Authentication State (MẬT KHẨU BAN ĐẦU ĐỂ TRỐNG HOÀN TOÀN)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Bước chọn cơ sở ban đầu ngay sau khi đăng nhập
  const [hasSelectedInitialCampus, setHasSelectedInitialCampus] = useState(false);

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
  const [selectedCampus, setSelectedCampus] = useState('Cơ sở A - Nguyễn Đình Chiểu (Q.3)');

  // Match 1-1 Flow States
  const [matchStep, setMatchStep] = useState<'filter' | 'swiping' | 'requesting' | 'success'>('filter');
  const [currentCandidateIdx, setCurrentCandidateIdx] = useState(0);

  // Profile Sub-views
  const [profileSubView, setProfileSubView] = useState<'main' | 'info' | 'taste' | 'saved' | 'settings'>('main');

  // Chat Sub-views
  const [chatSubView, setChatSubView] = useState<'menu' | 'group_chat' | 'direct_list' | 'direct_chat'>('menu');
  const [selectedDirectUser, setSelectedDirectUser] = useState<any>(null);

  // Explore Filters & States
  const [exploreCampus, setExploreCampus] = useState<string>('Cơ sở A - Nguyễn Đình Chiểu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPlaceForNav, setSelectedPlaceForNav] = useState<any>(null);

  // System Data - Campuses
  const campuses = [
    { id: 'A', name: 'Cơ sở A - Nguyễn Đình Chiểu', full: 'Cơ sở A - Nguyễn Đình Chiểu (Q.3)', district: 'Q.3' },
    { id: 'B', name: 'Cơ sở B - Nguyễn Tri Phương', full: 'Cơ sở B - Nguyễn Tri Phương (Q.10)', district: 'Q.10' },
    { id: 'N', name: 'Cơ sở N - Nguyễn Văn Linh', full: 'Cơ sở N - Nguyễn Văn Linh (Bình Chánh)', district: 'Bình Chánh' },
    { id: 'C', name: 'Cơ sở C - 3 Tháng 2', full: 'Cơ sở C - 3 Tháng 2 (Q.10)', district: 'Q.10' },
    { id: 'E', name: 'Cơ sở E - Nguyễn Văn Thủ', full: 'Cơ sở E - Nguyễn Văn Thủ (Q.3)', district: 'Q.3' },
    { id: 'V', name: 'Cơ sở V - Võ Thị Sáu', full: 'Cơ sở V - Võ Thị Sáu (Q.3)', district: 'Q.3' }
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

  // Danh sách quán ăn, cà phê, công viên đa dạng ĐỦ RATING VÀ BÀN ĂN NHÓM
  const allPlaces = [
    // KHU VỰC QUẬN 3 (Gần CS A, E, V)
    { 
      id: 1, 
      name: 'Cơm Tấm Ba Cường', 
      type: 'Cơm tấm', 
      category: 'com_tam',
      campusGroup: 'Cơ sở A - Nguyễn Đình Chiểu',
      district: 'Q.3', 
      priceNum: 35,
      priceLabel: '35k', 
      rating: 4.8,
      reviewsCount: '120+ sinh viên UEH hay ghé',
      address: 'Cơm Tấm Ba Cường Nguyễn Đình Chiểu Quận 3',
      desc: 'Sườn nướng thơm phức, sát vách Cơ sở A UEH.',
      distText: 'Cách Cơ sở A 50m'
    },
    { 
      id: 2, 
      name: 'The Coffee House - Trần Cao Vân', 
      type: 'Cà phê & Deadline', 
      category: 'cafe',
      campusGroup: 'Cơ sở A - Nguyễn Đình Chiểu',
      district: 'Q.3', 
      priceNum: 45,
      priceLabel: '45k', 
      rating: 4.6,
      reviewsCount: '85+ lượt đánh giá',
      address: 'The Coffee House Trần Cao Vân Quận 3',
      desc: 'Không gian rộng rãi, nhiều ổ cắm điện, wifi cực nhanh.',
      distText: 'Cách Cơ sở A 150m'
    },
    { 
      id: 3, 
      name: 'Công Viên Tao Đàn', 
      type: 'Công viên & Chill', 
      category: 'park',
      campusGroup: 'Cơ sở A - Nguyễn Đình Chiểu',
      district: 'Q.3', 
      priceNum: 0,
      priceLabel: 'Miễn phí', 
      rating: 4.9,
      reviewsCount: '200+ lượt check-in',
      address: 'Công viên Tao Đàn Quận 3',
      desc: 'Nhiều cây xanh mát mẻ, thích hợp mua trà sữa ra ngồi hóng mát tám chuyện.',
      distText: 'Cách Cơ sở A 500m'
    },
    { 
      id: 4, 
      name: 'Trà Sữa Phượng Hoàng', 
      type: 'Trà sữa', 
      category: 'tra_sua',
      campusGroup: 'Cơ sở A - Nguyễn Đình Chiểu',
      district: 'Q.3', 
      priceNum: 20,
      priceLabel: '20k', 
      rating: 4.7,
      reviewsCount: '310+ món ngon rẻ',
      address: 'Trà sữa Phượng Hoàng Nguyễn Tri Phương Quận 10',
      desc: 'Trà sữa đậm vị trà, topping trân châu ngon rẻ đúng chuẩn sinh viên.',
      distText: 'Cách Cơ sở A 800m'
    },
    { 
      id: 5, 
      name: 'Bún Đậu Ngõ Nhỏ Phố Nhỏ', 
      type: 'Bún đậu', 
      category: 'bun_dau',
      campusGroup: 'Cơ sở E - Nguyễn Văn Thủ',
      district: 'Q.3', 
      priceNum: 40,
      priceLabel: '40k', 
      rating: 4.5,
      reviewsCount: '60+ sinh viên khen',
      address: 'Bún đậu Ngõ Nhỏ Phố Nhỏ Nguyễn Đình Chiểu Quận 3',
      desc: 'Mắm tôm pha ngon chuẩn vị Bắc, chả cốm chiên giòn rụm.',
      distText: 'Cách Cơ sở E 200m'
    },

    // KHU VỰC QUẬN 10 (Gần CS B, CS C)
    { 
      id: 6, 
      name: 'Căn Tin B2 UEH', 
      type: 'Cơm tấm & Căn tin', 
      category: 'com_tam',
      campusGroup: 'Cơ sở B - Nguyễn Tri Phương',
      district: 'Q.10', 
      priceNum: 30,
      priceLabel: '30k', 
      rating: 4.9,
      reviewsCount: '500+ sinh viên ăn mỗi ngày',
      address: 'Đại học Kinh tế TP.HCM Cơ sở B 279 Nguyễn Tri Phương Quận 10',
      desc: 'Món ăn thay đổi theo ngày, ngon lành sạch sẽ nằm ngay trong trường.',
      distText: 'Tại Cơ sở B'
    },
    { 
      id: 7, 
      name: 'Highlands Coffee N2TP', 
      type: 'Cà phê & Deadline', 
      category: 'cafe',
      campusGroup: 'Cơ sở B - Nguyễn Tri Phương',
      district: 'Q.10', 
      priceNum: 39,
      priceLabel: '39k', 
      rating: 4.6,
      reviewsCount: '150+ nhóm học tập',
      address: 'Highlands Coffee Nguyễn Tri Phương Quận 10',
      desc: 'Đối diện CS B, máy lạnh mát rượi, chỗ ngồi cày bài nhóm.',
      distText: 'Đối diện Cơ sở B'
    },
    { 
      id: 8, 
      name: 'Bún Đậu A Chảnh', 
      type: 'Bún đậu', 
      category: 'bun_dau',
      campusGroup: 'Cơ sở B - Nguyễn Tri Phương',
      district: 'Q.10', 
      priceNum: 45,
      priceLabel: '45k', 
      rating: 4.8,
      reviewsCount: '190+ nhóm tụ tập',
      address: 'Bún đậu A Chảnh Thành Thái Quận 10',
      desc: 'Mẹt bún đậu đầy đặn, chân giò luộc và nem chua rán thơm phức.',
      distText: 'Cách Cơ sở B 400m'
    },
    { 
      id: 9, 
      name: 'Công Viên Lê Thị Riêng', 
      type: 'Công viên & Chill', 
      category: 'park',
      campusGroup: 'Cơ sở C - 3 Tháng 2',
      district: 'Q.10', 
      priceNum: 0,
      priceLabel: 'Miễn phí', 
      rating: 4.7,
      reviewsCount: '140+ sinh viên đi dạo',
      address: 'Công viên Lê Thị Riêng Cách Mạng Tháng 8 Quận 10',
      desc: 'Khuôn viên hồ nước thoáng mát, thích hợp đi dạo chill sau giờ học.',
      distText: 'Cách Cơ sở C 600m'
    },

    // KHU VỰC BÌNH CHÁNH (Gần CS N)
    { 
      id: 10, 
      name: 'Căn tin N1', 
      type: 'Căn tin sinh viên', 
      category: 'com_tam',
      campusGroup: 'Cơ sở N - Nguyễn Văn Linh',
      district: 'Bình Chánh', 
      priceNum: 35,
      priceLabel: '35k', 
      rating: 4.8,
      reviewsCount: 'Phổ biến nhất Cơ sở N',
      address: 'Cơ sở N UEH Nguyễn Văn Linh Bình Chánh',
      desc: 'Không gian rộng rãi, nhiều món ăn hot trend chuẩn sinh viên.',
      distText: 'Cách Cơ sở N 0m'
    },
    { 
      id: 11, 
      name: 'Cheers - Cửa Hàng Tiện Lợi', 
      type: 'Ăn vặt & Tiện lợi', 
      category: 'an_vat',
      campusGroup: 'Cơ sở N - Nguyễn Văn Linh',
      district: 'Bình Chánh', 
      priceNum: 25,
      priceLabel: '25k', 
      rating: 4.5,
      reviewsCount: '90+ ghé nhanh',
      address: 'Cheers Nguyễn Văn Linh Bình Chánh',
      desc: 'Máy lạnh 24/7, có sẵn xúc xích, mì ly và bàn ngồi học.',
      distText: 'Cách Cơ sở N 0m'
    },
    { 
      id: 12, 
      name: 'Mỳ Cay SEOUL Phạm Hùng', 
      type: 'Mỳ cay & Ăn vặt', 
      category: 'an_vat',
      campusGroup: 'Cơ sở N - Nguyễn Văn Linh',
      district: 'Bình Chánh', 
      priceNum: 60,
      priceLabel: '60k', 
      rating: 4.7,
      reviewsCount: '110+ nhóm sinh viên',
      address: 'Mỳ Cay Seoul Phạm Hùng Bình Chánh',
      desc: 'Mỳ cay 7 cấp độ đậm đà, lẩu kim chi topping ngập tràn.',
      distText: 'Cách Cơ sở N 3.2km'
    },
    { 
      id: 13, 
      name: 'Công Viên KDC Mizuki Park', 
      type: 'Công viên & Chill', 
      category: 'park',
      campusGroup: 'Cơ sở N - Nguyễn Văn Linh',
      district: 'Bình Chánh', 
      priceNum: 0,
      priceLabel: 'Miễn phí', 
      rating: 4.9,
      reviewsCount: '80+ sống ảo',
      address: 'Mizuki Park Nguyễn Văn Linh Bình Chánh',
      desc: 'Cảnh quan sông nước cây xanh hiện đại, cực đẹp để chụp ảnh và chill.',
      distText: 'Cách Cơ sở N 2km'
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

    setDirectMessages(prev => [...prev, { id: Date.now(), sender: studentName || 'Vy', text: userText, isMe: true }]);
    setDirectInput('');

    setIsFriendTyping(true);

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

  // Lọc danh sách địa điểm ở mục Khám Phá
  const filteredPlaces = allPlaces.filter(place => {
    const matchCampus = place.campusGroup.includes(exploreCampus.split('-')[0].trim());
    
    const matchQuery = searchQuery.trim() === '' || 
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.type.toLowerCase().includes(searchQuery.toLowerCase());

    let matchPrice = true;
    if (selectedPriceFilter === '25k') matchPrice = place.priceNum <= 25;
    if (selectedPriceFilter === '40k') matchPrice = place.priceNum <= 40;
    if (selectedPriceFilter === '50k') matchPrice = place.priceNum <= 50;
    if (selectedPriceFilter === '100k') matchPrice = place.priceNum <= 100;

    let matchCat = true;
    if (selectedCategoryFilter !== 'all') {
      matchCat = place.category === selectedCategoryFilter;
    }

    return matchCampus && matchQuery && matchPrice && matchCat;
  });

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

        {/* MÀN HÌNH 1: ĐĂNG NHẬP TÀI KHOẢN */}
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
                <label className="text-[11px] font-bold text-slate-600">Password</label>
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
        ) : !hasSelectedInitialCampus ? (
          /* MÀN HÌNH 2: BƯỚC CHỌN CƠ SỞ BAN ĐẦU NGAY SAU KHI ĐĂNG NHẬP + MỤC GHÉP NHÓM (CỦA HÌNH 1) */
          <div className="flex-1 p-6 space-y-6 bg-slate-50/50">
            <div className="space-y-1 pt-2">
              <h2 className="text-xl font-black text-slate-800">Xin chào {studentName}!</h2>
              <p className="text-sm font-bold text-slate-700">Bây giờ bạn đang ở đâu?</p>
            </div>

            <div className="space-y-3">
              {campuses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setExploreCampus(c.name);
                    setSelectedCampus(c.full);
                    setHasSelectedInitialCampus(true);
                  }}
                  className="w-full p-4 bg-orange-50/60 hover:bg-orange-100 border border-orange-100 rounded-2xl text-left font-bold text-xs text-slate-800 shadow-sm transition flex items-center justify-between"
                >
                  <span>{c.name}</span>
                  <ChevronRight className="w-4 h-4 text-orange-400" />
                </button>
              ))}
            </div>

            {/* BỔ SUNG MỤC TẠO & THAM GIA GHÉP NHÓM TRỰC TIẾP TẠI BƯỚC CHỌN CƠ SỞ BAN ĐẦU */}
            <div className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-3 pt-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-500" />
                <h3 className="font-black text-slate-800 text-xs">Hoặc Tạo / Tham Gia Bàn Ăn Ghép Nhóm</h3>
              </div>
              <p className="text-[11px] text-slate-500">Mở bàn ăn đông người cho cả nhóm cùng đi ăn trưa vui vẻ!</p>
              
              <button 
                onClick={() => {
                  setMatchMode('group');
                  setActiveTab('match');
                  setHasSelectedInitialCampus(true);
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>👥 Ghép Nhóm Ăn Trưa Ngay ➔</span>
              </button>
            </div>
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

            {/* TAB 2: KẾT NỐI (CÓ CẢ GHÉP ĐÔI 1-1 VÀ MỤC GHÉP NHÓM ĐÔNG NGƯỜI) */}
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
                          <option key={c.id} value={c.full}>{c.full}</option>
                        ))}
                      </select>
                    </div>

                    <button 
                      onClick={() => setMatchStep('swiping')} 
                      className="w-full py-3.5 bg-orange-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition"
                    >
                      {matchMode === 'duo' ? 'Tìm kiếm bạn ăn trưa 1-1 🚀' : 'Tham gia Bàn Ăn Nhóm 👥'}
                    </button>

                    {/* MỤC BÀN ĂN GHÉP NHÓM Bổ SUNG PHÍA DƯỚI PHẦN GHÉP ĐÔI 1-1 */}
                    <div className="p-4 bg-sky-50 rounded-3xl border border-sky-100 space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-sky-900">👥 Bàn Ăn Nhóm Đang Mở Quanh Bạn</span>
                        <span className="text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full font-bold">3 Nhóm online</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="p-3 bg-white rounded-2xl border flex items-center justify-between">
                          <div>
                            <div className="font-bold text-xs text-slate-800">Nhóm Mỳ Cay Cùng K49</div>
                            <div className="text-[10px] text-slate-400">11:45 AM • CS N Bình Chánh (Đã có 3/5 bạn)</div>
                          </div>
                          <button 
                            onClick={() => { setActiveTab('chat'); setChatSubView('group_chat'); }}
                            className="px-3 py-1.5 bg-sky-500 text-white font-bold text-[10px] rounded-xl shadow-sm"
                          >
                            Vào bàn
                          </button>
                        </div>
                      </div>
                    </div>
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

            {/* TAB 3: KHÁM PHÁ (CHUẨN 100% THEO HÌNH 2 VỚI ĐỦ BỘ LỌC, RATING & GOOGLE MAPS) */}
            {activeTab === 'explore' && (
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black text-orange-600 uppercase">EAT TOGETHER</div>
                    <h1 className="text-xl font-black text-slate-800">Hôm nay, ăn gì? 😋</h1>
                    <p className="text-[11px] text-slate-400 font-medium">Quán ngon quanh trường, vừa túi tiền tụi mình.</p>
                  </div>
                  <button 
                    onClick={() => setHasSelectedInitialCampus(false)}
                    className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-xl"
                  >
                    Đổi CS
                  </button>
                </div>

                {/* THANH TÌM KIẾM TƯƠNG TÁC */}
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm quán cơm, bún, mì, trà sữa quanh UEH..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>

                {/* CHIPS CHỌN NHANH CƠ SỞ (THEO HÌNH 2) */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {campuses.map((c) => {
                    const isSelected = exploreCampus.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => setExploreCampus(c.name)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                          isSelected 
                            ? 'bg-sky-100 text-sky-800 border-sky-300 shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        📍 {c.name}
                      </button>
                    );
                  })}
                </div>

                {/* BỘ LỌC GIÁ: <25k, <40k, <50k, <100k (THEO HÌNH 2) */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Giá</span>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'Tất cả' },
                      { id: '25k', label: '<25k' },
                      { id: '40k', label: '<40k' },
                      { id: '50k', label: '<50k' },
                      { id: '100k', label: '<100k' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPriceFilter(p.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition ${
                          selectedPriceFilter === p.id 
                            ? 'bg-orange-500 text-white border-orange-500' 
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* BỘ LỌC DANH MỤC: CƠM TẤM, BÚN ĐẬU, TRÀ SỮA, ĂN VẶT, CÀ PHÊ, CÔNG VIÊN (THEO HÌNH 2) */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'com_tam', label: 'Cơm tấm' },
                    { id: 'bun_dau', label: 'Bún đậu' },
                    { id: 'tra_sua', label: 'Trà sữa' },
                    { id: 'an_vat', label: 'Ăn vặt' },
                    { id: 'cafe', label: 'Cà phê & Deadline' },
                    { id: 'park', label: 'Công viên & Chill' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                        selectedCategoryFilter === cat.id 
                          ? 'bg-slate-800 text-white border-slate-800' 
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* DANH SÁCH QUÁN NGON GẦN BẠN CÓ ĐIỂM ĐÁNH GIÁ (RATING) */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-sm">Quán ngon gần bạn</h3>
                    <span className="text-[10px] text-slate-400 font-bold">Gần nhất ∨</span>
                  </div>

                  {filteredPlaces.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border text-xs text-slate-400">
                      Chưa tìm thấy địa điểm phù hợp với bộ lọc này. Bạn thử chọn danh mục hoặc mức giá khác nha!
                    </div>
                  ) : (
                    filteredPlaces.map((place) => (
                      <div 
                        key={place.id} 
                        onClick={() => setSelectedPlaceForNav(place)}
                        className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-2 hover:shadow-md transition cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                              {place.name}
                              <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-amber-200">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {place.rating}
                              </span>
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium">📍 {place.distText} ({place.district})</p>
                          </div>
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-xl">
                            {place.type}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500">{place.desc}</p>

                        <div className="p-2 bg-sky-50/60 rounded-xl border border-sky-100 text-[10px] font-bold text-sky-800 flex items-center gap-1">
                          <span>🔥</span> {place.reviewsCount}
                        </div>

                        <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Giá trung bình</span>
                            <span className="font-black text-orange-600 text-sm">{place.priceLabel} <span className="text-[10px] font-normal text-slate-400">/ người</span></span>
                          </div>
                          <button className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold rounded-xl flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> Chỉ đường Maps ➔
                          </button>
                        </div>
                      </div>
                    ))
                  )}
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
                        onClick={() => {
                          setIsLoggedIn(false);
                          setHasSelectedInitialCampus(false);
                        }}
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
        {isLoggedIn && hasSelectedInitialCampus && (
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

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border">
                  <span className="font-bold text-slate-700 block">Mô tả quán:</span>
                  <span className="text-slate-600">{selectedPlaceForNav.desc}</span>
                </div>
                <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100">
                  <span className="font-bold text-orange-800 block">Vị trí:</span>
                  <span className="text-orange-900">{selectedPlaceForNav.distText}</span>
                </div>
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