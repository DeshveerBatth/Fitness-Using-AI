import { Button, Box, FormControl, InputLabel, Select, TextField, Alert } from '@mui/material';
import { MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { addActivity } from '../api';

const ActivityForm = ({ onActivitiesAdded }) => {
    const [activity, setActivity] = useState({
        type: "RUNNING",
        duration: '',
        caloriesBurned: '',
        additionalMetrics: {}
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        // Add validation
        if (!activity.duration || !activity.caloriesBurned) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        // Check localStorage for debugging
        console.log('🔍 LocalStorage check:', {
            userId: localStorage.getItem('userId'),
            token: localStorage.getItem('token') ? 'Present' : 'Missing'
        });

        console.log('📤 Submitting activity:', activity);

        try {
            console.log('⏳ Making API call...');
            
            const result = await addActivity(activity);
            console.log('✅ API response:', result);
            
            setSuccess(true);
            onActivitiesAdded();
            setActivity({ type: "RUNNING", duration: '', caloriesBurned: '', additionalMetrics: {} });
            
        } catch (error) {
            console.error("❌ Detailed error:", error);
            
            let errorMessage = 'Unknown error';
            
            if (error.response) {
                // Server responded with error
                errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
            } else if (error.request) {
                // Request was made but no response
                errorMessage = 'No response from server. Check if backend is running.';
            } else {
                // Something else happened
                errorMessage = error.message;
            }
            
            setError(`Error adding activity: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Activity added successfully!
                </Alert>
            )}

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="activity-type-label">Activity Type</InputLabel>
                <Select
                    labelId="activity-type-label"
                    label="Activity Type"
                    value={activity.type}
                    onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                >
                    <MenuItem value="RUNNING">Running</MenuItem>
                    <MenuItem value="CYCLING">Cycling</MenuItem>
                    <MenuItem value="SWIMMING">Swimming</MenuItem>
                    <MenuItem value="WEIGHTLIFTING">Weightlifting</MenuItem>
                </Select>
            </FormControl>
           
            <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                sx={{ mb: 2 }}
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                required
            />
           
            <TextField
                fullWidth
                label="Calories Burned"
                type="number"
                sx={{ mb: 2 }}
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                required
            />
           
            <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                sx={{ mb: 2 }}
                disabled={isLoading}
            >
                {isLoading ? 'Adding...' : 'Add Activity'}
            </Button>
        </Box>
    );
};

export default ActivityForm;