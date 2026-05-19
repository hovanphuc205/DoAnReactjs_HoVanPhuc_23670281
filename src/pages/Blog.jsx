import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { Calendar, User, ArrowRight, X, Clock, Share2 } from 'lucide-react';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'Bí quyết pha cà phê ngon tại nhà',
    excerpt: 'Làm thế nào để có một tách cà phê đậm đà chuẩn vị quán ngay tại gian bếp nhà bạn? Hãy cùng khám phá các bước...',
    content: `
      Pha cà phê ngon tại nhà không khó nếu bạn nắm vững các nguyên tắc cơ bản. Dưới đây là 3 yếu tố quan trọng nhất:
      
      1. Nguồn nước tinh khiết: Nước chiếm 98% ly cà phê. Hãy sử dụng nước lọc thay vì nước máy trực tiếp để không làm ảnh hưởng đến hương vị tự nhiên của hạt.
      2. Tỉ lệ vàng: Tỉ lệ 1:15 (1g cà phê tương ứng 15g nước) là khởi đầu hoàn hảo cho hầu hết các phương pháp pha.
      3. Độ mịn của bột: Mỗi phương pháp pha (Phin, Pour-over, Espresso) đều yêu cầu một độ mịn khác nhau. Hãy đầu tư một chiếc máy xay mini để luôn có bột cà phê tươi mới nhất.
      
      Hãy thử bắt đầu với một túi hạt Arabica rang vừa, bạn sẽ cảm nhận được sự khác biệt ngay lập tức!
    `,
    author: 'Admin',
    date: '10/05/2026',
    readTime: '5 phút',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Nguồn gốc của hạt cà phê Arabica',
    excerpt: 'Hạt Arabica từ lâu đã nổi tiếng với hương thơm quyến rũ và vị chua thanh nhẹ nhàng. Bạn có biết chúng đến từ đâu...',
    content: `
      Cà phê Arabica (Coffea arabica) có nguồn gốc từ vùng cao nguyên Ethiopia. Đây là loại cà phê đầu tiên được con người canh tác và hiện chiếm khoảng 60% sản lượng cà phê toàn cầu.
      
      Đặc điểm của Arabica:
      - Hình dáng: Hạt hơi dài, rãnh giữa hạt có hình chữ S.
      - Hương vị: Vị chua thanh, hậu vị ngọt, chứa ít caffeine hơn Robusta.
      - Điều kiện sống: Chỉ phát triển tốt ở độ cao trên 1000m so với mực nước biển, trong khí hậu ôn hòa.
      
      Tại CoffeeSpace, chúng tôi tự hào sử dụng những hạt Arabica tuyển chọn từ vùng Cầu Đất - Đà Lạt, nơi có điều kiện thổ nhưỡng tuyệt vời nhất Việt Nam cho loại hạt này.
    `,
    author: 'Chuyên gia',
    date: '08/05/2026',
    readTime: '7 phút',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Top 5 quán cà phê đẹp nhất Sài Gòn',
    excerpt: 'Bạn đang tìm kiếm một không gian yên tĩnh để làm việc hay một góc sống ảo cực chill? Đừng bỏ qua danh sách này...',
    content: `
      Sài Gòn không thiếu quán cà phê, nhưng để tìm được một nơi vừa có thức uống ngon, vừa có không gian nghệ thuật thì đây là 5 gợi ý hàng đầu:
      
      1. CoffeeSpace (Chi nhánh Quận 5): Không gian hiện đại, tối giản với nhiều mảng xanh, cực kỳ thích hợp để làm việc nhóm.
      2. L'Usine: Phong cách Indochine hoài cổ, tọa lạc trong những căn chung cư cũ đầy quyến rũ.
      3. The Workshop: Nơi hội tụ của những tín đồ Specialty Coffee với thiết kế mở và quầy bar cực dài.
      4. Dabao Concept: Một "Hội An thu nhỏ" giữa lòng Sài Gòn với kiến trúc gỗ và tone màu ấm cúng.
      5. Ollin Coffee: Không gian rộng rãi, hiện đại với tone màu trắng chủ đạo, ánh sáng tự nhiên ngập tràn.
      
      Mỗi quán đều mang một nét cá tính riêng, hãy dành thời gian cuối tuần này để khám phá nhé!
    `,
    author: 'Cộng tác viên',
    date: '05/05/2026',
    readTime: '6 phút',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
  }
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const closeModal = () => setSelectedPost(null);

  return (
    <div className="min-h-screen font-sans" style={{ background: '#FAFAF7' }}>
      <Navbar />
      <CartDrawer />

      {/* Header */}
      <div className="pt-32 pb-20 text-center bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1500&q=80" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Blog & Tin tức</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto px-6 leading-relaxed">
            Khám phá thế giới cà phê đầy cảm hứng qua những câu chuyện và kiến thức chia sẻ từ chuyên gia của CoffeeSpace.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                  Cà phê & Đời sống
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" /> {post.date}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" /> {post.readTime}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all group/btn"
                  >
                    Đọc tiếp <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-2 text-gray-400">
                    <User size={14} /> <span className="text-xs">{post.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl flex flex-col">
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur text-white rounded-full flex items-center justify-center transition-all"
            >
              <X size={24} />
            </button>
            
            <div className="overflow-y-auto">
              <div className="h-72 md:h-96 w-full relative">
                <img src={selectedPost.image} className="w-full h-full object-cover" alt={selectedPost.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 md:p-12">
                  <div>
                    <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                      <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold text-white uppercase">Nổi bật</span>
                      <span className="flex items-center gap-1.5"><Calendar size={16} /> {selectedPost.date}</span>
                      <span className="flex items-center gap-1.5"><User size={16} /> {selectedPost.author}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                      {selectedPost.title}
                    </h2>
                  </div>
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  {selectedPost.content.split('\n').map((paragraph, idx) => (
                    paragraph.trim() && (
                      <p key={idx} className="text-gray-600 leading-relaxed mb-6 text-lg">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>
                
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      {selectedPost.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold">{selectedPost.author}</p>
                      <p className="text-gray-500 text-sm">Biên tập viên CoffeeSpace</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all flex items-center gap-2">
                      <Share2 size={18} /> Chia sẻ
                    </button>
                    <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all shadow-lg shadow-primary/20">
                      Đăng ký nhận tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Blog;
