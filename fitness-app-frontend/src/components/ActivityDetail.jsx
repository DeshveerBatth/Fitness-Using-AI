import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getActivityDetail } from '../api';
import { 
  Box, 
  Card, 
  CardContent, 
  Divider, 
  Typography, 
  Alert,
  Skeleton,
  Chip,
  Stack,
  IconButton,
  Avatar,
  Paper,
  Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchActivityDetail = async () => {
    if (!id) {
      setError('Activity ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Fetching activity detail for ID:', id);
      const response = await getActivityDetail(id);
      console.log('✅ Full API response:', response);
      console.log('📊 Response data:', response.data);
      console.log('🏃 Activity type:', response.data?.type);
      console.log('⏱️ Duration:', response.data?.duration);
      console.log('🔥 Calories:', response.data?.caloriesBurned);
      
      setActivity(response.data);
    } catch (error) {
      console.error('❌ Error fetching activity detail:', error);
      setError(error.message || 'Failed to fetch activity details');
    } finally {
      setLoading(false);
    }
  };

  fetchActivityDetail();
}, [id]);


  // Activity type icons and colors
  const getActivityIcon = (type) => {
    const icons = {
      'RUNNING': '🏃‍♂️',
      'WALKING': '🚶‍♂️',
      'SWIMMING': '🏊‍♂️',
      'CYCLING': '🚴‍♂️',
      'HIKING': '🥾',
      'JOGGING': '🏃‍♀️',
      'SKATING': '⛸️',
      'SKIING': '⛷️',
      'SURFING': '🏄‍♂️',
      'ROWING': '🚣‍♂️',
      'DANCING': '💃',
      'CLIMBING': '🧗‍♂️',
      'JUMPING': '🦘',
      'YOGA': '🧘‍♂️',
      'BOXING': '🥊',
      'KICKBOXING': '🥋',
      'SKIPPING': '🪅',
      'PUSHUPS': '💪',
      'SITUPS': '🤸‍♂️',
      'WEIGHTLIFTING': '🏋️‍♂️',
      'MARTIAL_ARTS': '🥋',
      'TENNIS': '🎾',
      'BADMINTON': '🏸',
      'BASKETBALL': '🏀',
      'FOOTBALL': '⚽',
      'VOLLEYBALL': '🏐',
      'BASEBALL': '⚾',
      'CRICKET': '🏏',
      'GOLF': '⛳',
      'TABLE_TENNIS': '🏓',
      'PARAGLIDING': '🪂',
      'OTHER': '🏃'
    };
    return icons[type] || '💪';
  };

  const getActivityColor = (type) => {
    const colors = {
      'RUNNING': '#FF6B6B',
      'WALKING': '#4ECDC4',
      'SWIMMING': '#45B7D1',
      'CYCLING': '#96CEB4',
      'HIKING': '#FECA57',
      'JOGGING': '#FF9FF3',
      'SKATING': '#54A0FF',
      'SKIING': '#5F27CD',
      'SURFING': '#00D2D3',
      'ROWING': '#FF9F43',
      'DANCING': '#FF6B81',
      'CLIMBING': '#786FA6',
      'JUMPING': '#F8B500',
      'YOGA': '#3742FA',
      'BOXING': '#2F3542',
      'KICKBOXING': '#57606F',
      'SKIPPING': '#2ED573',
      'PUSHUPS': '#1E90FF',
      'SITUPS': '#FFA726',
      'WEIGHTLIFTING': '#6C5CE7',
      'MARTIAL_ARTS': '#A55EEA',
      'TENNIS': '#26DE81',
      'BADMINTON': '#FD79A8',
      'BASKETBALL': '#FDCB6E',
      'FOOTBALL': '#6C5CE7',
      'VOLLEYBALL': '#74B9FF',
      'BASEBALL': '#00B894',
      'CRICKET': '#00CEC9',
      'GOLF': '#55A3FF',
      'TABLE_TENNIS': '#FF7675',
      'PARAGLIDING': '#A29BFE',
      'OTHER': '#DDA0DD'
    };
    return colors[type] || '#6C5CE7';
  };

  const formatActivityName = (type) => {
    if (!type) return 'Unknown Activity';
    return type.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const handleGoBack = () => {
    navigate('/activities');
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Skeleton variant="rectangular" width={40} height={40} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" height={50} />
          <Skeleton variant="text" width="40%" height={30} />
          <Skeleton variant="text" width="50%" height={30} />
          <Skeleton variant="text" width="45%" height={30} />
        </Paper>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <IconButton onClick={handleGoBack} sx={{ mb: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Error loading activity details: {error}
          </Alert>
        </Paper>
      </Box>
    );
  }

  // No activity found
  if (!activity) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <IconButton onClick={handleGoBack} sx={{ mb: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            No activity found with ID: {id}
          </Alert>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 900, 
      mx: 'auto', 
      p: 3,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Back Button */}
      <IconButton 
        onClick={handleGoBack}
        sx={{ 
          mb: 2,
          bgcolor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            bgcolor: 'white',
            transform: 'translateX(-2px)'
          }
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Main Activity Card */}
      <Card sx={{ 
        mb: 3, 
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header with Avatar and Title */}
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar 
              sx={{ 
                bgcolor: getActivityColor(activity.type),
                width: 70,
                height: 70,
                fontSize: '32px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
              }}
            >
              {getActivityIcon(activity.type)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                color: '#2d3748',
                mb: 1
              }}>
                {formatActivityName(activity.type)}
              </Typography>
              <Chip 
                label="Activity Details"
                sx={{ 
                  bgcolor: getActivityColor(activity.type) + '20',
                  color: getActivityColor(activity.type),
                  fontWeight: 600
                }}
              />
            </Box>
          </Stack>

          {/* Stats Grid */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Duration
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: getActivityColor(activity.type),
                  mt: 0.5
                }}>
                  {formatNumber(activity.duration)} 
                  <Typography component="span" variant="body1" color="text.secondary">
                    min
                  </Typography>
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Calories Burned
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: getActivityColor(activity.type),
                  mt: 0.5
                }}>
                  {formatNumber(activity.caloriesBurned)}
                  <Typography component="span" variant="body1" color="text.secondary">
                    kcal
                  </Typography>
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'rgba(255,255,255,0.7)',
                borderRadius: 2,
                border: '1px solid rgba(0,0,0,0.05)'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Date
                </Typography>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: '#2d3748',
                  mt: 0.5
                }}>
                  {activity.createdAt ? 
                    new Date(activity.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'Today'
                  }
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Additional Metrics */}
          {activity.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
                Additional Metrics
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(activity.additionalMetrics).map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Paper elevation={0} sx={{ 
                      p: 2,
                      bgcolor: 'rgba(255,255,255,0.5)',
                      borderRadius: 2,
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendation Card */}
      {activity.recommendation && (
        <Card sx={{ 
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              🤖 AI Recommendations
            </Typography>
            
            {/* Analysis Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Analysis
              </Typography>
              <Typography sx={{ fontSize: '1.1rem', lineHeight: 1.6, opacity: 0.95 }}>
                {activity.recommendation}
              </Typography>
            </Box>
            
            {/* Improvements Section */}
            {activity.improvements && activity.improvements.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  💡 Improvements
                </Typography>
                <Stack spacing={1}>
                  {activity.improvements.map((improvement, index) => (
                    <Typography key={index} sx={{ opacity: 0.9, pl: 2 }}>
                      • {improvement}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}
            
            {/* Suggestions Section */}
            {activity.suggestions && activity.suggestions.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  ✨ Suggestions
                </Typography>
                <Stack spacing={1}>
                  {activity.suggestions.map((suggestion, index) => (
                    <Typography key={index} sx={{ opacity: 0.9, pl: 2 }}>
                      • {suggestion}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}
            
            {/* Safety Guidelines Section */}
            {activity.safety && activity.safety.length > 0 && (
              <Box>
                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  ⚠️ Safety Guidelines
                </Typography>
                <Stack spacing={1}>
                  {activity.safety.map((safety, index) => (
                    <Typography key={index} sx={{ 
                      opacity: 0.9, 
                      pl: 2,
                      bgcolor: 'rgba(255,255,255,0.1)',
                      p: 1,
                      borderRadius: 1
                    }}>
                      • {safety}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;
