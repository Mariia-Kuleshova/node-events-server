export function isAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({
      error: "Не авторизований",
    });
  }

  next();
}

export function isAdmin(req, res, next) {
  if (req.session.user?.role !== "admin") {
    return res.status(403).json({
      error: "Доступ тільки для адміна",
    });
  }

  next();
}

export function isOrganizer(req, res, next) {
  if (!["admin", "organizer"].includes(req.session.user?.role)) {
    return res.status(403).json({
      error: "Недостатньо прав",
    });
  }

  next();
}
