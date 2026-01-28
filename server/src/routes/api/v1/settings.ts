import { Router } from 'express';

import SettingsController from '@server/controllers/SettingsController';

// TODO: Add admin-level authorization middleware when multi-user support is implemented.
// Settings modification should be restricted to admin users only.

const router = Router();

router.get('/', SettingsController.getAll);
router.get('/:section', SettingsController.getSection);
router.put('/:section', SettingsController.updateSection);
router.post('/validate', SettingsController.validate);

export default router;
