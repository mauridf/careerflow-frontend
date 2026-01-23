import { Alert, AlertTitle, Box, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  severity?: 'error' | 'warning' | 'info' | 'success';
  fullWidth?: boolean;
}

const ErrorMessage = ({ 
  title = 'Erro', 
  message, 
  onRetry, 
  severity = 'error',
  fullWidth = false
}: ErrorMessageProps) => {
  return (
    <Box sx={{ 
      width: fullWidth ? '100%' : 'auto',
      maxWidth: 600,
      mx: 'auto'
    }}>
      <Alert 
        severity={severity}
        icon={<ErrorOutlineIcon />}
        action={
          onRetry && (
            <Button 
              color="inherit" 
              size="small" 
              onClick={onRetry}
            >
              Tentar novamente
            </Button>
          )
        }
        sx={{ mb: 2 }}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;