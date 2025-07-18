import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
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
  Stack
} from '@mui/material';

const ActivityDetail = () => {
  const { id } = useParams();
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
        console.log('✅ Activity detail fetched:', response.data);
        
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

  // Loading state
  if (loading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="45%" />
            <Skeleton variant="text" width="35%" />
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Alert severity="error">
          Error loading activity details: {error}
        </Alert>
      </Box>
    );
  }

  // No activity found
  if (!activity) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Alert severity="info">
          No activity found with ID: {id}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {/* Activity Details Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h1">
              Activity Details
            </Typography>
            <Chip 
              label={activity.type} 
              color="primary" 
              variant="outlined"
            />
          </Stack>
          
          <Stack spacing={1}>
            <Typography variant="body1">
              <strong>Type:</strong> {activity.type}
            </Typography>
            <Typography variant="body1">
              <strong>Duration:</strong> {activity.duration} minutes
            </Typography>
            <Typography variant="body1">
              <strong>Calories Burned:</strong> {activity.caloriesBurned}
            </Typography>
            <Typography variant="body1">
              <strong>Date:</strong> {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'N/A'}
            </Typography>
            
            {/* Additional Metrics */}
            {activity.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>Additional Metrics</Typography>
                {Object.entries(activity.additionalMetrics).map(([key, value]) => (
                  <Typography key={key} variant="body2">
                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
                  </Typography>
                ))}
              </>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* AI Recommendation Card */}
      {activity.recommendation && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              AI Recommendation
            </Typography>
            
            {/* Analysis Section */}
            <Typography variant="h6" gutterBottom>
              Analysis
            </Typography>
            <Typography paragraph>
              {activity.recommendation}
            </Typography>
            
            {/* Improvements Section */}
            {activity.improvements && activity.improvements.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Improvements
                </Typography>
                <Stack spacing={1}>
                  {activity.improvements.map((improvement, index) => (
                    <Typography key={index} variant="body2">
                      • {improvement}
                    </Typography>
                  ))}
                </Stack>
              </>
            )}
            
            {/* Suggestions Section */}
            {activity.suggestions && activity.suggestions.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Suggestions
                </Typography>
                <Stack spacing={1}>
                  {activity.suggestions.map((suggestion, index) => (
                    <Typography key={index} variant="body2">
                      • {suggestion}
                    </Typography>
                  ))}
                </Stack>
              </>
            )}
            
            {/* Safety Guidelines Section */}
            {activity.safety && activity.safety.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Safety Guidelines
                </Typography>
                <Stack spacing={1}>
                  {activity.safety.map((safety, index) => (
                    <Typography key={index} variant="body2" color="warning.main">
                      • {safety}
                    </Typography>
                  ))}
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;