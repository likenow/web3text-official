import React from 'react';
import * as ReactDOM from 'react-dom/client';

import Dialog from '@mui/material/Dialog';
import styled from '@emotion/styled';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const IconWrapper = styled.div``;

const DialogWrapper = styled.div`
  padding: 20px;
  min-width: 300px;
  width: 100%;
  max-width: 450px;
  display: flex;
`;

const DialogTitle = styled.div`
  font-size: 20px;
  line-height: 1.8;
  text-align: center;
  display: flex;
`;

const DialogContent = styled.div`
  margin-left: 15px;
`;

const DialogBody = styled.div`
  margin-top: 10px;
  color: #00000073;
  line-height: 1.6;
  a {
    border-bottom: 1px solid;
  }
`;

function SimpleModal(props: any) {
  const { onClose, visible } = props;

  return (
    <Dialog onClose={onClose} open={visible}>
      <DialogWrapper>
        {props.type && (
          <IconWrapper>
            {props.type === 'success' ? (
              <CheckCircleIcon
                sx={{
                  fontSize: '40',
                }}
                color='success'
              ></CheckCircleIcon>
            ) : (
              <ErrorIcon
                sx={{
                  fontSize: '40',
                }}
                color='error'
              ></ErrorIcon>
            )}
          </IconWrapper>
        )}
        <DialogContent>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogBody>{props.body}</DialogBody>
        </DialogContent>
      </DialogWrapper>
    </Dialog>
  );
}

function showMessage(options: any) {
  const { title, body, type } = options;
  const container = document.createDocumentFragment();
  const root = ReactDOM.createRoot(container);

  function render({visible} : {visible:any}) {
    root.render(
      <SimpleModal
        title={title}
        visible={visible}
        body={body}
        type={type}
        onClose={close}
      />
    );
  }

  function close() {
    render({ visible: false });
  }

  render({ visible: true });
}

export default showMessage;
