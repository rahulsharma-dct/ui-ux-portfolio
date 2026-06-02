import React, { useState } from 'react';

export const FeedbackForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'activation' | 'error'>('idle');
  const [showServerProperties, setShowServerProperties] = useState(false);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!email || !feedback) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Submitting to FormSubmit.co keyless AJAX endpoint for Jyoti's email
      const response = await fetch('https://formsubmit.co/ajax/jyotidhiman4463@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          message: feedback,
          _subject: 'Portfolio Feedback from ' + email,
          _replyto: email,
          _honey: '', // Honeypot field for spam prevention
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Check if FormSubmit requires email activation (first-time use)
        if (data.success === 'true' || data.success === true) {
          setSubmitStatus('success');
          setEmail('');
          setFeedback('');
        } else if (data.message && (data.message.includes('confirm') || data.message.includes('Activate') || data.message.includes('Activation'))) {
          // One-time activation pending state
          setSubmitStatus('activation');
          setEmail('');
          setFeedback('');
        } else {
          // If already verified or other success, treat as sent
          setSubmitStatus('success');
          setEmail('');
          setFeedback('');
        }
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#ECE9D8] text-xs font-sans text-black relative select-none">
      
      {/* Outlook Express Menu Bar */}
      <div className="flex items-center space-x-3 px-2 py-1 border-b border-[#D8D4C8] bg-[#ECE9D8] text-[11px]">
        <span className="hover:bg-[#316ac5] hover:text-white px-2 py-0.5 cursor-pointer rounded-sm">File</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-2 py-0.5 cursor-pointer rounded-sm">Edit</span>
        <span className="hover:bg-[#316ac5] hover:text-white px-2 py-0.5 cursor-pointer rounded-sm">View</span>
        <span 
          onClick={() => setShowServerProperties(true)}
          className="hover:bg-[#316ac5] hover:text-white px-2 py-0.5 cursor-pointer rounded-sm"
        >
          Tools
        </span>
        <span className="hover:bg-[#316ac5] hover:text-white px-2 py-0.5 cursor-pointer rounded-sm">Help</span>
      </div>

      {/* Outlook Express Toolbar */}
      <div className="flex items-center space-x-1.5 p-1 border-b border-[#A0A0A0] bg-[#ECE9D8]">
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
          disabled={isSubmitting || !email || !feedback}
          className={`flex flex-col items-center justify-center p-1 px-3 border border-transparent rounded-[3px] hover:bg-[#316ac5] hover:text-white hover:border-[#102040] transition-colors ${
            (isSubmitting || !email || !feedback) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <span className="text-xl">📤</span>
          <span className="font-bold text-[10px] mt-0.5">Send</span>
        </button>

        <button
          onClick={() => { setEmail(''); setFeedback(''); setSubmitStatus('idle'); }}
          className="flex flex-col items-center justify-center p-1 px-3 border border-transparent rounded-[3px] hover:bg-[#316ac5] hover:text-white transition-colors cursor-pointer"
        >
          <span className="text-xl">🗑️</span>
          <span className="font-bold text-[10px] mt-0.5">Clear</span>
        </button>
        
        <button
          onClick={() => setShowServerProperties(true)}
          className="flex flex-col items-center justify-center p-1 px-3 border border-transparent rounded-[3px] hover:bg-[#316ac5] hover:text-white transition-colors cursor-pointer"
        >
          <span className="text-xl">⚙️</span>
          <span className="font-bold text-[10px] mt-0.5">Properties</span>
        </button>
        
        <div className="h-8 w-[1px] bg-[#A0A0A0] mx-1"></div>
        <div className="flex flex-col justify-center text-[10px] text-gray-500 font-mono">
          <div>Server: mail.jyoti.design</div>
          <div>Secure: SSL/TLS</div>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)} className="flex-grow p-4 space-y-3 flex flex-col justify-between overflow-auto">
        <div className="space-y-2">
          {/* To Field */}
          <div className="flex items-center border-b border-[#CCCCCC] pb-1.5">
            <span className="w-16 text-gray-500 font-bold text-right pr-3 select-none">To:</span>
            <div className="flex-grow font-semibold text-[#000] bg-[#ECE9D8] py-0.5 px-1 border border-transparent">
              Jyoti Dhiman &lt;jyotidhiman4463@gmail.com&gt;
            </div>
          </div>

          {/* From / Email Field */}
          <div className="flex items-center border-b border-[#CCCCCC] pb-1.5">
            <span className="w-16 text-gray-500 font-bold text-right pr-3 select-none">From:</span>
            <input
              type="email"
              required
              placeholder="your-email@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="flex-grow bg-white border border-[#7F9DB9] px-2 py-1 outline-none text-xs focus:border-[#245DDA] select-text"
            />
          </div>

          {/* Subject Field */}
          <div className="flex items-center border-b border-[#CCCCCC] pb-1.5">
            <span className="w-16 text-gray-500 font-bold text-right pr-3 select-none">Subject:</span>
            <input
              type="text"
              readOnly
              value="Portfolio Feedback & Inquiries"
              className="flex-grow bg-[#EAE8DF] border border-transparent px-2 py-1 outline-none text-xs text-gray-600 font-semibold"
            />
          </div>
        </div>

        {/* Message / Feedback Box */}
        <div className="flex-grow flex flex-col space-y-1 mt-2 min-h-[120px]">
          <label className="text-gray-500 font-bold select-none">Message:</label>
          <textarea
            required
            placeholder="Hi Jyoti, I checked out your portfolio and..."
            value={feedback}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
            className="flex-grow w-full border border-[#7F9DB9] p-2.5 outline-none resize-none font-sans text-[12px] focus:border-[#245DDA] select-text"
          ></textarea>
        </div>

        {/* Action Status bar */}
        <div className="mt-3 flex items-center justify-between border-t border-[#A0A0A0] pt-2">
          <div className="flex items-center space-x-1.5">
            {isSubmitting && (
              <span className="text-[11px] text-gray-600 animate-pulse flex items-center">
                <span className="animate-spin mr-1">⏳</span> Submitting message to outbox...
              </span>
            )}
            {submitStatus === 'error' && (
              <span className="text-[11px] text-[#C62828] font-bold flex items-center bg-[#FFEBEE] px-2 py-1 border border-[#FFCDD2] rounded-sm">
                ❌ Submit failed. Please try again.
              </span>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || !email || !feedback}
            className="xp-btn-classic px-5 py-1.5 font-bold border border-[#707070] bg-[#ECE9D8] hover:bg-[#E2DFD3] active:bg-[#C0BCAE] transition-colors rounded shadow-sm flex items-center justify-center space-x-1 cursor-pointer w-full sm:w-auto text-black"
          >
            <span>Send Message</span>
          </button>
        </div>
      </form>

      {/* Classic Windows XP Success Modal Dialog */}
      {submitStatus === 'success' && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div 
            className="w-[300px] bg-[#ECE9D8] rounded-t-[5px] border-[3px] border-[#0055e5] shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 10px 25px rgba(0,0,0,0.4), inset 1px 1px 0px #fff'
            }}
          >
            {/* Titlebar */}
            <div className="xp-titlebar-blue px-2 py-1 flex justify-between items-center text-white font-bold text-[11px]">
              <span>Outlook Express</span>
              <button 
                onClick={() => setSubmitStatus('idle')}
                className="w-4 h-4 bg-[#E2684B] border border-white rounded-[2px] flex items-center justify-center text-[9px] hover:bg-[#D03D1A] font-sans pb-[1px]"
              >
                ✕
              </button>
            </div>

            {/* Message Area */}
            <div className="p-4 flex items-start space-x-3 bg-white flex-grow">
              <span className="text-3xl select-none">ℹ️</span>
              <div className="text-[11px] leading-relaxed font-sans text-gray-800">
                <p className="font-bold text-black mb-1">Message Sent!</p>
                <p>Your message has been sent successfully in the background!</p>
              </div>
            </div>

            {/* Button Area */}
            <div className="bg-[#ECE9D8] p-2 flex justify-center border-t border-[#D3D3D3]">
              <button
                onClick={() => setSubmitStatus('idle')}
                className="xp-btn-classic px-5 py-1 text-[11px] font-bold rounded text-black cursor-pointer shadow-xs min-w-[60px]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* One-time Activation Dialog Box */}
      {submitStatus === 'activation' && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div 
            className="w-[320px] bg-[#ECE9D8] rounded-t-[5px] border-[3px] border-[#0053eb] shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 10px 25px rgba(0,0,0,0.4), inset 1px 1px 0px #fff'
            }}
          >
            {/* Titlebar */}
            <div className="xp-titlebar-blue px-2 py-1 flex justify-between items-center text-white font-bold text-[11px] select-none">
              <span>Outlook Express - Mail Server Warning</span>
              <button 
                onClick={() => setSubmitStatus('idle')}
                className="w-4 h-4 bg-[#E2684B] border border-white rounded-[2px] flex items-center justify-center text-[9px] hover:bg-[#D03D1A] font-sans pb-[1px]"
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 flex items-start space-x-3 bg-white flex-grow">
              <span className="text-3xl select-none">⚠️</span>
              <div className="text-[11px] leading-relaxed font-sans text-gray-800">
                <p className="font-bold text-black mb-1">Activation Required</p>
                <p>FormSubmit has sent a one-time confirmation email to <strong>jyotidhiman4463@gmail.com</strong>.</p>
                <p className="mt-2 font-bold text-[#D03D1A]">Please check your inbox (and spam folder) and click the "Activate Form" button.</p>
                <p className="mt-1 text-gray-500 text-[10px]">Once activated, all messages will deliver instantly in the background without any setup!</p>
              </div>
            </div>

            {/* OK Button */}
            <div className="bg-[#ECE9D8] p-2 flex justify-center border-t border-[#D3D3D3]">
              <button
                onClick={() => setSubmitStatus('idle')}
                className="xp-btn-classic px-5 py-1 text-[11px] font-bold rounded text-black cursor-pointer shadow-xs min-w-[60px]"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Static Mail Server Properties Info Box */}
      {showServerProperties && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div 
            className="w-[320px] bg-[#ECE9D8] rounded-t-[5px] border-[3px] border-[#0055e5] shadow-2xl flex flex-col overflow-hidden"
            style={{
              boxShadow: '0 10px 25px rgba(0,0,0,0.4), inset 1px 1px 0px #fff'
            }}
          >
            {/* Titlebar */}
            <div className="xp-titlebar-blue px-2 py-1 flex justify-between items-center text-white font-bold text-[11px]">
              <span>mail.jyoti.design Properties</span>
              <button 
                onClick={() => setShowServerProperties(false)}
                className="w-4 h-4 bg-[#E2684B] border border-white rounded-[2px] flex items-center justify-center text-[9px] hover:bg-[#D03D1A] font-sans pb-[1px]"
              >
                ✕
              </button>
            </div>

            {/* Tab content */}
            <div className="p-3 space-y-3">
              <div className="border border-gray-400 bg-white p-3 space-y-2 rounded text-[11px]">
                <div className="font-bold text-[#001C70] border-b border-gray-100 pb-0.5">Server Information</div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Outgoing Mail (SMTP):</span>
                  <span className="font-bold font-mono">formsubmit.co</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Status:</span>
                  <span className="text-green-700 font-bold">Keyless / Activated</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Target Address:</span>
                  <span className="font-bold font-mono">jyotidhiman4463@gmail.com</span>
                </div>
              </div>

              {/* OK Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowServerProperties(false)}
                  className="xp-btn-classic px-5 py-1 text-[11px] font-bold rounded text-black cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
