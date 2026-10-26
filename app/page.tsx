'use client';

import { useState } from 'react';

// Danh sách 6 sinh viên UEH với đầy đủ Khoá & Mong muốn học tập
const INITIAL_PROFILES = [
  {
    id: 1,
    name: 'Minh Anh',
    cohort: 'K50',
    campus: 'Cơ sở B (Nguyễn Tri Phương)',
    major: 'Kinh doanh quốc tế',
    bio: 'Thèm bún đậu mắm tôm Hoà Hảo quá, tìm cạ đi ăn trưa quanh CS B nè! 🍲',
    studyGoal: '💡 Tìm người ham học hỏi, cùng luyện nói Tiếng Anh giao tiếp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
    location: 'Quán Bún Đậu Hoà Hảo (Cách CS B 200m)',
    budget: '35k - 50k',
    time: '11:30 - 12:30',
  },
  {
    id: 2,
    name: 'Quốc Bảo',
    cohort: 'K49',
    campus: 'Cơ sở A (Nguyễn Đình Chiểu)',
    major: 'Marketing',
    bio: 'Cần cạ đi ăn Cơm tấm Ba Cường bàn chuyện chạy Deadline! Bao trà đá 🧊',
    studyGoal: '🤝 Muốn kết bạn mở rộng mối quan hệ & làm đồ án môn học',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60',
    location: 'Cơm Tấm Ba Cường (Gần CS A)',
    budget: '45k - 60k',
    time: '12:00 - 13:00',
  },
  {
    id: 3,
    name: 'Thảo Nhi',
    cohort: 'K51',
    campus: 'Cơ sở N (Nguyễn Văn Linh)',
    major: 'Tài chính công',
    bio: 'Trưa nay rủ các UEHer ở CS N đi ăn lẩu ly & uống trà sữa nè! 🧋',
    studyGoal: '📚 Tìm cạ cùng học thư viện, ôn thi giữa kỳ các môn đại cương',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60',
    location: 'Lẩu Ly Căng tin CS N',
    budget: '30k - 45k',
    time: '11:45 - 12:45',
  },
  {
    id: 4,
    name: 'Hoàng Long',
    cohort: 'K49',
    campus: 'Cơ sở B (Nguyễn Tri Phương)',
    major: 'Thương mại điện tử',
    bio: 'Tìm bạn ăn mì cay Sasin đường Ngô Gia Tự cấp độ 3 trưa nay 🌶️',
    studyGoal: '💡 Tìm người ham học hỏi về mảng lập trình & Data Analysis',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60',
    location: 'Mì Cay Sasin (Gần CS B)',
    budget: '50k - 80k',
    time: '12:15 - 13:15',
  },
  {
    id: 5,
    name: 'Phương Linh',
    cohort: 'K52',
    campus: 'Cơ sở V (Võ Văn Kiệt)',
    major: 'Kế toán doanh nghiệp',
    bio: 'Tân sinh viên K52 chưa quen khu vực CS V, ai dẫn đi ăn bún thịt nướng với! 🥗',
    studyGoal: '🤝 Muốn kết bạn mới để trao đổi kinh nghiệm học tập tại UEH',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60',
    location: 'Bún Thịt Nướng Cô Ba (Gần CS V)',
    budget: '30k - 40k',
    time: '11:30 - 12:30',
  },
  {
    id: 6,
    name: 'Đức Anh',
    cohort: 'K50',
    campus: 'Cơ sở H (Phạm Ngọc Thạch)',
    major: 'Quản trị kinh doanh',
    bio: 'Cần bạn đi ăn hủ tiếu gõ thảo luận đề tài NCkh sinh viên trưa nay 🍜',
    studyGoal: '📖 Lập nhóm săn học bổng UEH & làm NCKH',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60',
    location: 'Hủ Tiếu Nam Vang (Gần CS H)',
    budget: '40k - 55k',
    time: '12:00 - 13:00',
  },
];

// Danh sách sinh viên đang hoạt động
const ACTIVE_STUDENTS = [
  { id: 101, name: 'Khánh Vy', cohort: 'K50', campus: 'Cơ sở B', major: 'Ngân hàng', goal: 'Cần tìm bạn ham học hỏi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=60' },
  { id: 102, name: 'Gia Huy', cohort: 'K51', campus: 'Cơ sở A', major: 'Logistics', goal: 'Muốn kết bạn trao đổi môn học', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60' },
  { id: 103, name: 'Trúc Anh', cohort: 'K52', campus: 'Cơ sở N', major: 'Kinh tế đầu tư', goal: 'Muốn kết bạn làm quen tân sinh viên', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60' },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<'swipe' | 'invites' | 'chats'>('swipe');
  const [selectedCampus, setSelectedCampus] = useState('Tất cả');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<any[]>([]);

  // Quản lý lời mời đã nhận & đã gửi
  const [receivedInvites, setReceivedInvites] = useState<any[]>([
    {
      id: 99,
      name: 'Thanh Hằng',
      cohort: 'K50',
      campus: 'Cơ sở B',
      major: 'Kiểm toán',
      location: 'Cơm Trưa Văn Phòng 39k',
      studyGoal: '💡 Tìm người ham học hỏi',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60',
    },
  ]);
  const [sentInvites, setSentInvites] = useState<any[]>([]);

  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<{ [key: number]: string[] }>({
    1: ['Chào bạn nha! Trưa nay rảnh ăn bún đậu mắm tôm trao đổi bài không?'],
  });
  const [inputMsg, setInputMsg] = useState('');

  const filteredProfiles = INITIAL_PROFILES.filter((profile) => {
    if (selectedCampus === 'Tất cả') return true;
    return profile.campus.includes(selectedCampus);
  });

  const currentProfile = filteredProfiles[currentIndex];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.endsWith('@st.ueh.edu.vn')) {
      setError('⚠️ Vui lòng nhập email sinh viên UEH (@st.ueh.edu.vn)!');
      return;
    }
    if (password.length < 6) {
      setError('⚠️ Mật khẩu phải từ 6 ký tự trở lên!');
      return;
    }
    setError('');
    setIsLoggedIn(true);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right' && currentProfile) {
      if (!sentInvites.some((item) => item.id === currentProfile.id)) {
        setSentInvites((prev) => [...prev, currentProfile]);
      }
      alert(`🎉 Đã gửi lời mời ăn trưa tới ${currentProfile.name} (${currentProfile.cohort})!`);
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleAcceptInvite = (invite: any) => {
    setMatches((prev) => [...prev, invite]);
    setReceivedInvites((prev) => prev.filter((item) => item.id !== invite.id));
    alert(`🤝 Bạn và ${invite.name} (${invite.cohort}) đã trở thành cạ ăn trưa! Hãy vào tab "Trò chuyện" để hẹn giờ nhé.`);
  };

  const handleDeclineInvite = (id: number) => {
    setReceivedInvites((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSendActiveInvite = (student: any) => {
    if (!sentInvites.some((item) => item.id === student.id)) {
      setSentInvites((prev) => [...prev, student]);
      alert(`📩 Đã gửi lời mời ăn trưa tới ${student.name} (${student.cohort})!`);
    } else {
      alert(`⚠️ Bạn đã gửi lời mời cho ${student.name} rồi.`);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeChat) return;

    setMessages((prev) => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), `Bạn: ${inputMsg}`],
    }));
    setInputMsg('');
  };

  // ---------------- MÀN HÌNH ĐĂNG NHẬP (GIAO DIỆN 12PM) ----------------
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#003566', fontFamily: 'sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '35px 25px', borderRadius: '28px', width: '100%', maxWidth: '380px', color: '#333', boxShadow: '0 15px 35px rgba(0,0,0,0.3)', textAlign: 'center' }}>
          
          <h1 style={{ color: '#003566', margin: 0, fontSize: '3.5rem', fontWeight: '900', tracking: '2px' }}>12PM</h1>
          <p style={{ color: '#e63946', fontWeight: 'bold', marginTop: '4px', fontSize: '0.95rem', fontStyle: 'italic' }}>
            "Một bữa trưa là một cuộc gặp gỡ"
          </p>
          <p style={{ color: '#718096', fontSize: '0.75rem', marginBottom: '25px' }}>Dành riêng cho Sinh viên ĐH Kinh tế TP.HCM (UEH)</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568' }}>Email sinh viên UEH:</label>
              <input
                type="email"
                placeholder="ten.nguyen@st.ueh.edu.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '10px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568' }}>Mật khẩu:</label>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '10px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }}
              />
            </div>

            {error && <p style={{ color: '#e63946', fontSize: '0.8rem', margin: 0 }}>{error}</p>}

            <button
              type="submit"
              style={{ backgroundColor: '#003566', color: '#fff', padding: '13px', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '8px' }}
            >
              Đăng nhập bằng Email UEH
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ---------------- MÀN HÌNH CHÍNH ----------------
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', backgroundColor: '#f4f7f6', fontFamily: 'sans-serif' }}>
      
      {/* Header Top Bar */}
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#003566', color: '#fff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>12PM</h2>
        <span style={{ fontSize: '0.75rem', backgroundColor: '#e63946', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>@st.ueh.edu.vn</span>
      </div>

      <div style={{ width: '100%', maxWidth: '420px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#fff', position: 'relative' }}>
        
        {/* --- TAB 1: KHÁM PHÁ QUẸT THẺ --- */}
        {activeTab === 'swipe' && (
          <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
            
            <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#4a5568' }}>📍 Cơ sở:</span>
              <select
                value={selectedCampus}
                onChange={(e) => {
                  setSelectedCampus(e.target.value);
                  setCurrentIndex(0);
                }}
                style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '0.85rem', fontWeight: 'bold', color: '#003566' }}
              >
                <option value="Tất cả">Tất cả Cơ sở</option>
                <option value="Cơ sở A">Cơ sở A (Quận 3)</option>
                <option value="Cơ sở B">Cơ sở B (Quận 10)</option>
                <option value="Cơ sở N">Cơ sở N (Bình Chánh)</option>
                <option value="Cơ sở V">Cơ sở V (Võ Văn Kiệt)</option>
                <option value="Cơ sở H">Cơ sở H (Quận 3)</option>
              </select>
            </div>

            {currentProfile ? (
              <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', overflow: 'hidden', border: '1px solid #edf2f7', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative' }}>
                  <img src={currentProfile.avatar} alt={currentProfile.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                  {/* Nhãn hiển thị Khoá sinh viên UEH */}
                  <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#003566', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {currentProfile.cohort} UEH
                  </span>
                </div>

                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#003566', fontSize: '1.3rem' }}>
                      {currentProfile.name} <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: 'normal' }}>({currentProfile.cohort})</span>
                    </h3>
                    <p style={{ color: '#e63946', fontWeight: 'bold', margin: '3px 0 6px 0', fontSize: '0.8rem' }}>
                      🏫 {currentProfile.campus} • {currentProfile.major}
                    </p>

                    {/* MONG MUỐN HỌC TẬP */}
                    <div style={{ backgroundColor: '#f0fff4', border: '1px solid #c6f6d5', padding: '8px 10px', borderRadius: '10px', marginBottom: '8px' }}>
                      <p style={{ color: '#276749', fontSize: '0.8rem', margin: 0, fontWeight: 'bold' }}>
                        {currentProfile.studyGoal}
                      </p>
                    </div>

                    <div style={{ backgroundColor: '#f0f4f8', padding: '8px 10px', borderRadius: '10px', marginBottom: '8px' }}>
                      <p style={{ color: '#2b6cb0', fontSize: '0.75rem', margin: '0 0 2px 0', fontWeight: 'bold' }}>📍 Địa điểm đề xuất:</p>
                      <p style={{ color: '#1a202c', fontSize: '0.85rem', margin: 0, fontWeight: 'bold' }}>{currentProfile.location}</p>
                    </div>

                    <p style={{ color: '#4a5568', fontSize: '0.8rem', margin: 0, lineHeight: '1.3' }}>"{currentProfile.bio}"</p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '10px' }}>
                    <button
                      onClick={() => handleSwipe('left')}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #cbd5e0', backgroundColor: '#fff', color: '#a0aec0', fontSize: '1.2rem', cursor: 'pointer' }}
                    >
                      ✖
                    </button>
                    <button
                      onClick={() => handleSwipe('right')}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', border: 'none', backgroundColor: '#e63946', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(230,57,70,0.4)' }}
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                <h3 style={{ color: '#003566' }}>🎉 Đã xem hết danh sách!</h3>
                <p style={{ color: '#718096', fontSize: '0.85rem' }}>Không còn hồ sơ nào ở khu vực này.</p>
                <button onClick={() => setCurrentIndex(0)} style={{ padding: '8px 16px', backgroundColor: '#003566', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', marginTop: '10px' }}>
                  Xem lại từ đầu
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- TAB 2: LỜI MỜI & CÙNG ĂN TRƯA --- */}
        {activeTab === 'invites' && (
          <div style={{ padding: '15px', overflowY: 'auto', height: '100%', boxSizing: 'border-box' }}>
            
            {/* LỜI MỜI ĐÃ NHẬN */}
            <h3 style={{ color: '#003566', marginTop: 0, fontSize: '1.1rem' }}>📩 Lời mời đã nhận ({receivedInvites.length})</h3>
            {receivedInvites.length === 0 ? (
              <p style={{ color: '#a0aec0', fontSize: '0.85rem' }}>Chưa có lời mời mới nào.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {receivedInvites.map((invite) => (
                  <div key={invite.id} style={{ border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', backgroundColor: '#f7fafc' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <img src={invite.avatar} alt={invite.name} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, color: '#003566' }}>{invite.name}</h4>
                          <span style={{ fontSize: '0.75rem', backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '2px 6px', borderRadius: '6px', fontWeight: 'bold' }}>{invite.cohort}</span>
                        </div>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#e63946', fontWeight: 'bold' }}>{invite.campus}</p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#276749', fontWeight: 'bold' }}>{invite.studyGoal}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <button onClick={() => handleAcceptInvite(invite)} style={{ flex: 1, backgroundColor: '#2f855a', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.8rem', cursor: 'pointer' }}>
                        Đồng ý ăn cùng 🍲
                      </button>
                      <button onClick={() => handleDeclineInvite(invite.id)} style={{ backgroundColor: '#edf2f7', color: '#4a5568', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                        Từ chối
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* GIAO DIỆN CÙNG ĂN TRƯA - BẠN BÈ ĐANG HOẠT ĐỘNG */}
            <h3 style={{ color: '#003566', fontSize: '1.1rem', marginTop: '15px' }}>🟢 Sinh viên UEH đang hoạt động</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ACTIVE_STUDENTS.map((student) => (
                <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '12px', backgroundColor: '#fff', border: '1px solid #edf2f7', boxShadow: '0 2px 5px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={student.avatar} alt={student.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', backgroundColor: '#48bb78', borderRadius: '50%', border: '2px solid #fff' }}></span>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#2d3748' }}>
                        {student.name} <span style={{ fontSize: '0.75rem', color: '#2b6cb0', fontWeight: 'bold' }}>({student.cohort})</span>
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#718096' }}>{student.campus} • {student.goal}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSendActiveInvite(student)}
                    style={{ backgroundColor: '#e63946', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Rủ ăn trưa 🍱
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- TAB 3: TRÒ CHUYỆN --- */}
        {activeTab === 'chats' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {!activeChat ? (
              <div style={{ padding: '15px' }}>
                <h3 style={{ color: '#003566', marginTop: 0 }}>💬 Danh sách đã ghép đôi ({matches.length})</h3>
                {matches.length === 0 ? (
                  <p style={{ color: '#718096', fontSize: '0.85rem', textAlign: 'center', marginTop: '40px' }}>
                    Bạn chưa có cạ ăn trưa nào. Hãy sang mục <b>"Khám phá"</b> hoặc đồng ý lời mời để bắt đầu trò chuyện nhé!
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        onClick={() => setActiveChat(match)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '12px', backgroundColor: '#f7fafc', cursor: 'pointer', border: '1px solid #edf2f7' }}
                      >
                        <img src={match.avatar} alt={match.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <h4 style={{ margin: 0, color: '#2d3748' }}>
                            {match.name} <span style={{ fontSize: '0.8rem', color: '#2b6cb0' }}>({match.cohort})</span>
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#e63946', fontWeight: 'bold' }}>{match.campus}</p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096' }}>Bấm để nhắn tin hẹn quán ăn ➔</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '10px 15px', backgroundColor: '#edf2f7', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #cbd5e0' }}>
                  <button onClick={() => setActiveChat(null)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>⬅</button>
                  <img src={activeChat.avatar} alt={activeChat.name} style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#003566' }}>{activeChat.name} ({activeChat.cohort})</h4>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#718096' }}>{activeChat.campus}</p>
                  </div>
                </div>

                <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8fafc' }}>
                  {(messages[activeChat.id] || []).map((msg, index) => (
                    <div
                      key={index}
                      style={{
                        alignSelf: msg.startsWith('Bạn:') ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.startsWith('Bạn:') ? '#003566' : '#e2e8f0',
                        color: msg.startsWith('Bạn:') ? '#fff' : '#1a202c',
                        padding: '8px 14px',
                        borderRadius: '16px',
                        fontSize: '0.85rem',
                        maxWidth: '80%',
                      }}
                    >
                      {msg}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} style={{ padding: '10px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #cbd5e0', fontSize: '0.85rem' }}
                  />
                  <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#003566', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Gửi
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG (BOTTOM NAVIGATION) */}
      <div style={{ width: '100%', maxWidth: '420px', backgroundColor: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', padding: '10px 0' }}>
        <button
          onClick={() => { setActiveTab('swipe'); setActiveChat(null); }}
          style={{ border: 'none', background: 'none', color: activeTab === 'swipe' ? '#e63946' : '#718096', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          🔥 Khám phá
        </button>
        <button
          onClick={() => setActiveTab('invites')}
          style={{ border: 'none', background: 'none', color: activeTab === 'invites' ? '#e63946' : '#718096', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          📩 Lời mời ({receivedInvites.length})
        </button>
        <button
          onClick={() => setActiveTab('chats')}
          style={{ border: 'none', background: 'none', color: activeTab === 'chats' ? '#e63946' : '#718096', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          💬 Trò chuyện ({matches.length})
        </button>
      </div>

    </div>
  );
}