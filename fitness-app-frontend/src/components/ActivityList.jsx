import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, Typography, Grid } from '@mui/material';
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

    console.log('📊 Current state:', { activities, loading, error });

    if (loading) {
        return <div>Loading activities...</div>;
    }

    if (error) {
        return <div>Error loading activities: {error}</div>;
    }

    if (!activities || activities.length === 0) {
        return <div>No activities found</div>;
    }

    return (
        <Grid container spacing={2} sx={{ mt: 2 }}>
            {activities.map((activity) => (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                    <Card 
                        onClick={() => navigate(`/activities/${activity.id}`)} 
                        sx={{ cursor: 'pointer' }}
                    >
                        <CardContent>
                            <Typography variant="h6">{activity.type}</Typography>
                            <Typography variant="body2">Duration: {activity.duration} mins</Typography>
                            <Typography variant="body2">Calories Burned: {activity.caloriesBurned}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ActivityList;