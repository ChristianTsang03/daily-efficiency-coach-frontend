import { useState, useEffect } from 'react';
import {
  Box, Button, Container, Typography, Paper, TextField, Stack, List, ListItem, ListItemText, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';

function InsightsPage() {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  
  // Chat state placeholder
  const [messages, setMessages] = useState([
    { role: 'ai', text: "I'm your Daily Efficiency Coach. Let's review your weekly insights" }
  ]);

  // Mock Data for Insights - Replace with backend state later
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    // Simulate fetching insights from backend
    const fetchInsights = async () => {
      // const res = await api.get('/analytics/weekly-insights');
      // setInsights(res.data);
      
      setInsights({
        whatWorked: [
          "Completed 85% of high-priority tasks.",
          "Maintained a 5-day streak for Morning Workout."
        ],
        needsImprovement: [
          "Postponed 'Update Documentation' 3 times.",
          "Task completion drops significantly after 7 PM."
        ]
      });
    };
    
    fetchInsights();
  }, []);

  const handleSendMessage = () => {
    if (chatInput.trim() === '') {
      return;
    }

    const newMsg = { role: 'user', text: chatInput };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // TODO: Call backend AI endpoint here
    // const res = await api.post('/coach/chat', { message: chatInput });
    // setMessages((prev) => [...prev, { role: 'ai', text: res.data.reply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
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
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1B4F72' }}>
            Reflection Report
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
            {/* What Worked */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#4caf50', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon fontSize="small" /> What Worked
              </Typography>
              <List dense>
                {insights && insights.whatWorked.map((item, idx) => {
                   return (
                     <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                       <ListItemText primary={`• ${item}`} sx={{ color: '#5D6D7E' }} />
                     </ListItem>
                   );
                })}
              </List>
            </Box>

            {/* What Needs Improvement */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#f44336', display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon fontSize="small" /> What Needs Improvement
              </Typography>
              <List dense>
                {insights && insights.needsImprovement.map((item, idx) => {
                  return (
                    <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                      <ListItemText primary={`• ${item}`} sx={{ color: '#5D6D7E' }} />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Stack>
        </Paper>

        {/* AI Coach Chatbot Section */}
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, display: 'flex', flexDirection: 'column', height: 450 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1B4F72' }}>
            AI Coach
          </Typography>
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
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                </Box>
              );
            })}
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
              sx={{
                borderRadius: 3,
                bgcolor: '#1B4F72',
                minWidth: 50,
                px: 3,
                '&:hover': { bgcolor: '#2874A6' }
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