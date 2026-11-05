'use strict';

const caseDialogs = new Map(Array.from(document.querySelectorAll('[data-case-dialog]'), dialog => [dialog.dataset.caseDialog, dialog]));
let activeCaseTrigger = null;
const syncDialogLock = () => document.body.classList.toggle('dialog-open', Array.from(caseDialogs.values()).some(dialog => dialog.open));
const closeCase = dialog => {
  dialog.close();
  syncDialogLock();
};

document.querySelectorAll('[data-open-case]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = caseDialogs.get(button.dataset.openCase);
    if (!dialog) return;
    activeCaseTrigger = button;
    dialog.showModal();
    dialog.scrollTop = 0;
    syncDialogLock();
  });
});

caseDialogs.forEach(dialog => {
  dialog.querySelectorAll('[data-close-case]').forEach(button => {
    button.addEventListener('click', () => closeCase(dialog));
  });
  dialog.addEventListener('close', () => {
    syncDialogLock();
    if (!document.querySelector('dialog[open]')) activeCaseTrigger?.focus({preventScroll: true});
  });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeCase(dialog);
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeCase(dialog);
  });
});
