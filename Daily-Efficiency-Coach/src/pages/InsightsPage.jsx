import { useState, useEffect } from 'react';
import {
  Box, Button, Container, Typography, TextField, CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function InsightsPage() {
  const navigate = useNavigate();

  const [chatInput, setChatInput]         = useState('');
  const [chatLoading, setChatLoading]     = useState(false);
  const [reflectionLoading, setReflectionLoading] = useState(true);
  const [reflectionText, setReflectionText]       = useState(null);

  const [messages, setMessages] = useState([
    { role: 'ai', text: "I'm your Daily Efficiency Coach. Ask me anything about your productivity this week." }
  ]);

  // ── Fetch weekly reflection on load ───────────────────────────────────────

  useEffect(() => {
    const fetchReflection = async () => {
      setReflectionLoading(true);
      try {
        const res = await api.get('/ai/reflection');
        setReflectionText(res.data.reflection);
      } catch (err) {
        console.error('Failed to fetch reflection:', err);
        setReflectionText('Could not load reflection. Please try again later.');
      } finally {
        setReflectionLoading(false);
      }
    };
    fetchReflection();
  }, []);

  // ── Send message to AI coach ──────────────────────────────────────────────

  const handleSendMessage = async () => {
    if (chatInput.trim() === '') return;

    const newMsg = { role: 'user', text: chatInput };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await api.post('/ai/coach', { message: chatInput });
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch (err) {
      console.error('Failed to get AI response:', err);
      setMessages((prev) => [...prev, { role: 'ai', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div className="dec-page">
      <div className="dec-dotgrid" />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <h1 className="dec-page-title">AI Coach</h1>
            <p className="dec-page-subtitle">Weekly reflection and personalized guidance</p>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            className="dec-back-btn"
            sx={{ px: 2.5, py: 1 }}
          >
            Dashboard
          </Button>
        </Box>

        {/* ── Weekly Reflection ── */}
        <div className="dec-card" style={{ marginBottom: '1.25rem' }}>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: '#EBF5FB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 16, color: '#1B4F72' }} />
            </Box>
            <p className="dec-card-label" style={{ margin: 0 }}>Weekly Reflection</p>
          </Box>

          {reflectionLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <CircularProgress size={18} sx={{ color: '#1B4F72' }} />
              <Typography sx={{ fontSize: '0.875rem', color: '#8FA3B1' }}>
                Generating your weekly reflection...
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              p: 3,
              bgcolor: '#F8FBFD',
              borderRadius: '10px',
              border: '1px solid rgba(27,79,114,0.09)',
            }}>
              <Typography sx={{
                fontSize: '0.9rem',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.9,
                color: '#2C3E50',
              }}>
                {reflectionText}
              </Typography>
            </Box>
          )}
        </div>

        {/* ── AI Chatbot ── */}
        <div className="dec-card" style={{ padding: 0, overflow: 'hidden' }}>

          {/* Chat header bar */}
          <Box sx={{
            px: 3,
            py: 2,
            bgcolor: '#1B4F72',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 16, color: 'white' }} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>
                Efficiency Coach
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)' }}>
                Ask me anything about your week
              </Typography>
            </Box>
          </Box>

          {/* Message history */}
          <Box sx={{
            height: 360,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 3,
            bgcolor: '#F8FBFD',
          }}>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{ display: 'flex', justifyContent: msg.role === 'ai' ? 'flex-start' : 'flex-end' }}
              >
                <div className={msg.role === 'ai' ? 'dec-bubble-ai' : 'dec-bubble-user'}>
                  {msg.text}
                </div>
              </Box>
            ))}

            {/* Loading indicator */}
            {chatLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  bgcolor: '#EBF5FB',
                  borderRadius: '16px',
                  borderTopLeftRadius: '4px',
                }}>
                  <CircularProgress size={12} sx={{ color: '#1B4F72' }} />
                  <Typography sx={{ fontSize: '0.8rem', color: '#1B4F72' }}>
                    Thinking...
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Chat input */}
          <Box sx={{
            px: 3,
            py: 2,
            display: 'flex',
            gap: 1.5,
            bgcolor: 'white',
            borderTop: '1px solid rgba(27,79,114,0.07)',
          }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask your coach for advice..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={chatLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  bgcolor: '#F8FBFD',
                  fontSize: '0.875rem',
                  '& fieldset': { borderColor: 'rgba(27,79,114,0.15)' },
                  '&:hover fieldset': { borderColor: 'rgba(27,79,114,0.3)' },
                  '&.Mui-focused fieldset': { borderColor: '#1B4F72' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={chatLoading || !chatInput.trim()}
              className="dec-btn-primary"
              sx={{ minWidth: 48, width: 48, height: 40, p: 0, borderRadius: '10px' }}
            >
              <SendIcon sx={{ fontSize: 16 }} />
            </Button>
          </Box>

        </div>

      </Container>
    </div>
  );
}

export default InsightsPage;