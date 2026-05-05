import { useState, useEffect } from 'react';
import {
  Box, Button, Container, Typography, Paper, TextField,
  Divider, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function InsightsPage() {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [reflectionLoading, setReflectionLoading] = useState(true);

  const [messages, setMessages] = useState([
    { role: 'ai', text: "I'm your Daily Efficiency Coach. Ask me anything about your productivity this week." }
  ]);

  const [reflectionText, setReflectionText] = useState(null);

  // Fetch weekly reflection from backend on load
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

  // Send message to AI coach
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

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', backgroundColor: '#F2EFE9', py: 4, color: '#2C3E50' }}>
      <Container maxWidth="md">

        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ color: '#1B4F72' }}>
              Weekly Insights
            </Typography>
            <Typography variant="body2" sx={{ color: '#5D6D7E' }}>
              Reflection & AI Coaching
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              fontWeight: 600,
              borderRadius: 2.5,
              borderColor: '#A9CCE3',
              color: '#1B4F72',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'rgba(27, 79, 114, 0.05)', borderColor: '#1B4F72' },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>

        {/* Reflection Report Section */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AutoAwesomeIcon sx={{ color: '#1B4F72', fontSize: 20 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1B4F72' }}>
              Weekly Reflection
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {reflectionLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
              <CircularProgress size={20} sx={{ color: '#1B4F72' }} />
              <Typography variant="body2" sx={{ color: '#5D6D7E' }}>
                Generating your weekly reflection...
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              p: 3,
              bgcolor: '#EBF5FB',
              borderRadius: 3,
              border: '1px solid #D4E6F1',
            }}>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.9,
                  color: '#2C3E50',
                }}
              >
                {reflectionText}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* AI Coach Chatbot Section */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', height: 480 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CheckCircleIcon sx={{ color: '#1B4F72', fontSize: 20 }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1B4F72' }}>
              AI Coach
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Chat History */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, mb: 2, pr: 1 }}>
            {messages.map((msg, idx) => {
              const isAi = msg.role === 'ai';
              return (
                <Box key={idx} sx={{ display: 'flex', justifyContent: isAi ? 'flex-start' : 'flex-end' }}>
                  <Box
                    sx={{
                      maxWidth: '75%',
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: isAi ? '#E8F1F5' : '#1B4F72',
                      color: isAi ? '#1B4F72' : '#FFFFFF',
                      borderTopLeftRadius: isAi ? 4 : 12,
                      borderTopRightRadius: isAi ? 12 : 4,
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                      {msg.text}
                    </Typography>
                  </Box>
                </Box>
              );
            })}

            {/* Loading indicator while AI is responding */}
            {chatLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Box sx={{
                  p: 2,
                  borderRadius: 3,
                  backgroundColor: '#E8F1F5',
                  borderTopLeftRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <CircularProgress size={14} sx={{ color: '#1B4F72' }} />
                  <Typography variant="body2" sx={{ color: '#1B4F72' }}>
                    Thinking...
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Chat Input */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Ask your coach for advice..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={chatLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#F8F9FA',
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={chatLoading || !chatInput.trim()}
              sx={{
                borderRadius: 3,
                bgcolor: '#1B4F72',
                minWidth: 50,
                px: 3,
                '&:hover': { bgcolor: '#2874A6' },
                '&:disabled': { bgcolor: '#A9CCE3' },
              }}
            >
              <SendIcon fontSize="small" />
            </Button>
          </Box>
        </Paper>

      </Container>
    </Box>
  );
}

export default InsightsPage;