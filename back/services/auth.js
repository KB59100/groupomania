const {getRoleById} = require("../models/modelUsers");
function isAllowed(currentUserId, ownerId){
    if (!currentUserId) throw "l'utilisateur n'est pas reconnu";
    if (currentUserId === ownerId) return true;
    const role = getRoleById(currentUserId);
    if (role === 1) return true;
    throw "l'utilisateur n'est pas authorisé";
}

module.exports = {
    isAllowed
}