import { IconButton } from '@mui/material';
import { useState, Fragment } from 'react';

/**
 * This component adds an icon to the toolbar above the slide section in the presentation page.
 */
export default function AddIcon ({Icon, Dialog, type, token, slideIndex, presentationId, setPresentation}) {
  console.log(type);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const handleClickOpen = () => {
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  return (
    <Fragment>
      <IconButton aria-label={`add-${type}-icon`} onClick={handleClickOpen}>
        <Icon/>
      </IconButton>
      <Dialog
        token={token}
        slideIndex={slideIndex}
        presentationId={presentationId}
        setPresentation={setPresentation}
        isEdit={false}
        openEditDialog={openEditDialog}
        handleCloseEditDialog={handleClose}
      />
    </Fragment>
  )
}