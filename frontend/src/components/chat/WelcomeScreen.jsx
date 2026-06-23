import { MessageCircle } from 'lucide-react';

const WelcomeScreen = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      {/* Decorative background */}
      <div className="relative mb-8">
        <div className="absolute inset-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
        <div className="relative w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-2xl shadow-primary-500/20">
          <MessageCircle className="w-12 h-12 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">
        Welcome to ChatterBox
      </h2>
      <p className="text-dark-400 max-w-sm text-sm leading-relaxed">
        Select a conversation from the sidebar or search for someone to start
        chatting with. Your messages are delivered in real-time.
      </p>

      <div className="flex items-center gap-6 mt-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center">
            <span className="text-lg">💬</span>
          </div>
          <span className="text-xs text-dark-500">Real-time</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center">
            <span className="text-lg">🔒</span>
          </div>
          <span className="text-xs text-dark-500">Secure</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
          <span className="text-xs text-dark-500">Fast</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
