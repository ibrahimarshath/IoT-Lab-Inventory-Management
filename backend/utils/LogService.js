const InventoryLog = require('../models/inventoryLog');
const ActionLog = require('../models/ActionLog');

async function logInventory({ componentId, actorId, actorEmail, action, delta, beforeQty, afterQty, remark, metadata }) {
  try {
    return await InventoryLog.create({ componentId, actorId, actorEmail, action, delta, beforeQty, afterQty, remark, metadata });
  } catch (err) {
    console.error('Failed to write inventory log', err);
    return null;
  }
}

async function logAction({ actorId, actorEmail, action, targetType, targetId, details }) {
  try {
    return await ActionLog.create({ actorId, actorEmail, action, targetType, targetId, details });
  } catch (err) {
    console.error('Failed to write action log', err);
    return null;
  }
}

module.exports = { logInventory, logAction };
