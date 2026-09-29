import { Alert, Button } from '@mui/material';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      sx={{ alignItems: 'center', my: 2 }}
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Try again
          </Button>
        ) : null
      }
    >
      {message}
    </Alert>
  );
}