import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, Typography, Grid, Box, Chip, Avatar } from '@mui/material';
import { getActivity } from '../api';

const ActivityList = ({ refreshTrigger }) => {    
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    console.log('🔄 ActivityList component rendered');

    const fetchActivities = async () => {
        try {
            console.log('📋 Fetching activities...');
            setLoading(true);
            setError(null);
            
            const response = await getActivity();
            console.log('✅ Activities fetched:', response.data);
            
            setActivities(response.data || []);
        } catch (error) {
            console.error('❌ Error fetching activities:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [refreshTrigger]);

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
        if (!type) return 'Unknown';
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

    console.log('📊 Current state:', { activities, loading, error });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <Typography variant="h6">Loading your activities...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <Typography variant="h6" color="error">Error loading activities: {error}</Typography>
            </Box>
        );
    }

    if (!activities || activities.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <Typography variant="h6">No activities found. Add your first activity!</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2d3748', marginBottom: 3 }}>
                Your Activities ({activities.length})
            </Typography>
            
            <Grid container spacing={2}>
                {activities.map((activity) => (
                    <Grid 
                        item 
                        xs={12} 
                        sm={6} 
                        md={3} 
                        lg={3} 
                        xl={3}
                        key={activity.id}
                        sx={{
                            minWidth: '280px',
                            maxWidth: { xs: '100%', sm: '50%', md: '25%', lg: '25%', xl: '25%' }
                        }}
                    >
                        <Card 
                            onClick={() => navigate(`/activities/${activity.id}`)} 
                            sx={{ 
                                cursor: 'pointer',
                                height: 180,
                                width: '100%',
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                                }
                            }}
                        >
                            <CardContent sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between',
                                padding: '16px !important',
                                '&:last-child': {
                                    paddingBottom: '16px !important'
                                }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, marginBottom: 1 }}>
                                    <Avatar 
                                        sx={{ 
                                            bgcolor: getActivityColor(activity.type),
                                            width: 45,
                                            height: 45,
                                            fontSize: '20px',
                                            flexShrink: 0
                                        }}
                                    >
                                        {getActivityIcon(activity.type)}
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 600, 
                                                fontSize: '1rem',
                                                lineHeight: 1.2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                marginBottom: 0.5
                                            }}
                                        >
                                            {formatActivityName(activity.type)}
                                        </Typography>
                                        <Chip 
                                            label="Recent" 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: getActivityColor(activity.type) + '20',
                                                color: getActivityColor(activity.type),
                                                height: 20,
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </Box>
                                </Box>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                    <Box sx={{ 
                                        textAlign: 'center',
                                        flex: 1,
                                        padding: '8px 4px',
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        borderRadius: 1,
                                        minWidth: 0
                                    }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#718096', 
                                                fontWeight: 500,
                                                fontSize: '0.8rem',
                                                marginBottom: 0.25
                                            }}
                                        >
                                            Duration
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 700, 
                                                fontSize: '0.95rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {formatNumber(activity.duration)} min
                                        </Typography>
                                    </Box>
                                    
                                    <Box sx={{ 
                                        textAlign: 'center',
                                        flex: 1,
                                        padding: '8px 4px',
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        borderRadius: 1,
                                        minWidth: 0
                                    }}>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#718096', 
                                                fontWeight: 500,
                                                fontSize: '0.8rem',
                                                marginBottom: 0.25
                                            }}
                                        >
                                            Calories
                                        </Typography>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                fontWeight: 700, 
                                                fontSize: '0.95rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {formatNumber(activity.caloriesBurned)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ActivityList;
