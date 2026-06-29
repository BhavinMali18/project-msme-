const AuditLog = require("../models/AuditLog");

/**
 * Middleware to automatically log actions in the enterprise portal.
 * Usage: router.post('/route', auditLog('ACTION_NAME', 'EntityType'), controllerFn)
 */
const auditLogger = (action, entityType) => {
  return async (req, res, next) => {
    // Intercept res.json to capture the entity ID after it is created/modified
    const originalJson = res.json;

    res.json = async function (data) {
      try {
        // Only log successful operations
        if (res.statusCode >= 200 && res.statusCode < 300) {
          
          let entityId = null;
          
          // Try to infer entityId from the response or request params
          if (data && data._id) {
            entityId = data._id;
          } else if (data && data.user && data.user._id) {
            entityId = data.user._id;
          } else if (req.params.id) {
            entityId = req.params.id;
          }

          // In a real enterprise app, oldValue and newValue would be compared here
          // For now, we capture the core event footprint
          await AuditLog.create({
            userId: req.user ? req.user.id : null,
            action,
            entityType,
            entityId,
            ipAddress: req.ip || req.connection.remoteAddress
          });
        }
      } catch (err) {
        console.error("Audit log failed to write:", err);
      }

      // Call the original res.json
      return originalJson.call(this, data);
    };

    next();
  };
};

module.exports = auditLogger;
