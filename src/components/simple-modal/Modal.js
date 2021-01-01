import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';


export default function SimpleModal({open, body, handleClose}) {
 
  return (

      <Modal
        open={open}
        onClose={handleClose}
      >
        {body}
      </Modal>
   
  );
}