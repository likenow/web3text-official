import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

interface CSnackbarProps {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
  show: boolean;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  onClose?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomizedSnackbar(props: CSnackbarProps) {
  const { vertical, horizontal, show, type, title, onClose } = props;
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={show}
      onClose={onClose}
      key={vertical + horizontal}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
        {title}
      </Alert>
    </Snackbar>
  );
}

export default CustomizedSnackbar;
