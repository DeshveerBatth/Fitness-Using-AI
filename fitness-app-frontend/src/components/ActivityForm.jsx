import { Button, Box, FormControl, InputLabel, Menu, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Form } from 'react-router';

const ActivityForm = ({ onActivitiesAdded, addActivity }) => {
   
    const [activity, setActivity] = useState({
        type: "RUNNING",
        duration: '',
        caloriesBurned: '',
        additionalMetrics: {}
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await addActivity(activity);
            onActivitiesAdded();
            setActivity({ type: "RUNNING", duration: '', caloriesBurned: '', additionalMetrics: {} });
        }
        catch (error) {
            console.error("Error adding activity:", error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
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
            <Box sx={{ mb: 2 }} />
            <TextField fullWidth
                label="Duration (minutes)"
                type="number"
                sx={{ mb: 2 }}
                value={activity.duration}
                onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
            />
            <TextField fullWidth
                label="Calories Burned"
                type="number"
                sx={{ mb: 2 }}
                value={activity.caloriesBurned}
                onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mb: 2 }}>
                Add Activity
            </Button>
        </Box>
    );
};

export default ActivityForm;