import { Button, Box, FormControl, InputLabel, Select, TextField, Alert, Paper, Typography } from '@mui/material';
import { MenuItem } from '@mui/material';
import React, { useState } from 'react';
import { addActivity } from '../api';
import './ActivityComponents.css';

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

    // Complete activity types with icons
    const activityTypes = [
        { value: "RUNNING", label: "Running", icon: "🏃‍♂️" },
        { value: "WALKING", label: "Walking", icon: "🚶‍♂️" },
        { value: "SWIMMING", label: "Swimming", icon: "🏊‍♂️" },
        { value: "CYCLING", label: "Cycling", icon: "🚴‍♂️" },
        { value: "HIKING", label: "Hiking", icon: "🥾" },
        { value: "JOGGING", label: "Jogging", icon: "🏃‍♀️" },
        { value: "SKATING", label: "Skating", icon: "⛸️" },
        { value: "SKIING", label: "Skiing", icon: "⛷️" },
        { value: "SURFING", label: "Surfing", icon: "🏄‍♂️" },
        { value: "ROWING", label: "Rowing", icon: "🚣‍♂️" },
        { value: "DANCING", label: "Dancing", icon: "💃" },
        { value: "CLIMBING", label: "Climbing", icon: "🧗‍♂️" },
        { value: "JUMPING", label: "Jumping", icon: "🦘" },
        { value: "YOGA", label: "Yoga", icon: "🧘‍♂️" },
        { value: "BOXING", label: "Boxing", icon: "🥊" },
        { value: "KICKBOXING", label: "Kickboxing", icon: "🥋" },
        { value: "SKIPPING", label: "Skipping", icon: "🪅" },
        { value: "PUSHUPS", label: "Push-ups", icon: "💪" },
        { value: "SITUPS", label: "Sit-ups", icon: "🤸‍♂️" },
        { value: "WEIGHTLIFTING", label: "Weightlifting", icon: "🏋️‍♂️" },
        { value: "MARTIAL_ARTS", label: "Martial Arts", icon: "🥋" },
        { value: "TENNIS", label: "Tennis", icon: "🎾" },
        { value: "BADMINTON", label: "Badminton", icon: "🏸" },
        { value: "BASKETBALL", label: "Basketball", icon: "🏀" },
        { value: "FOOTBALL", label: "Football", icon: "⚽" },
        { value: "VOLLEYBALL", label: "Volleyball", icon: "🏐" },
        { value: "BASEBALL", label: "Baseball", icon: "⚾" },
        { value: "CRICKET", label: "Cricket", icon: "🏏" },
        { value: "GOLF", label: "Golf", icon: "⛳" },
        { value: "TABLE_TENNIS", label: "Table Tennis", icon: "🏓" },
        { value: "PARAGLIDING", label: "Paragliding", icon: "🪂" },
        { value: "OTHER", label: "Other", icon: "🏃" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        if (!activity.duration || !activity.caloriesBurned) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

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
                errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
            } else if (error.request) {
                errorMessage = 'No response from server. Check if backend is running.';
            } else {
                errorMessage = error.message;
            }
            
            setError(`Error adding activity: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper elevation={3} className="activity-form-container">
            <Typography variant="h5" className="form-title" gutterBottom>
                Add New Activity
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} className="activity-form">
                {error && (
                    <Alert severity="error" className="form-alert">
                        {error}
                    </Alert>
                )}
                
                {success && (
                    <Alert severity="success" className="form-alert">
                        Activity added successfully!
                    </Alert>
                )}

                <FormControl fullWidth className="form-field">
                    <InputLabel id="activity-type-label">Activity Type</InputLabel>
                    <Select
                        labelId="activity-type-label"
                        label="Activity Type"
                        value={activity.type}
                        onChange={(e) => setActivity({ ...activity, type: e.target.value })}
                        className="custom-select"
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 300,
                                    overflow: 'auto'
                                }
                            }
                        }}
                    >
                        {activityTypes.map((activityType) => (
                            <MenuItem key={activityType.value} value={activityType.value}>
                                {activityType.icon} {activityType.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
               
                <TextField
                    fullWidth
                    label="Duration (minutes)"
                    type="number"
                    className="form-field custom-input"
                    value={activity.duration}
                    onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                    required
                    InputProps={{
                        inputProps: { min: 1, max: 600 }
                    }}
                />
               
                <TextField
                    fullWidth
                    label="Calories Burned"
                    type="number"
                    className="form-field custom-input"
                    value={activity.caloriesBurned}
                    onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
                    required
                    InputProps={{
                        inputProps: { min: 1, max: 5000 }
                    }}
                />
               
                <Button 
                    type="submit" 
                    variant="contained" 
                    className="submit-btn"
                    disabled={isLoading}
                    fullWidth
                >
                    {isLoading ? 'Adding Activity...' : 'Add Activity'}
                </Button>
            </Box>
        </Paper>
    );
};

export default ActivityForm;
