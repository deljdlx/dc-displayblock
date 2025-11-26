// Simple physics engine for demonstration
// Note: Uses DOM coordinate system where Y increases DOWNWARD
class SimplePhysics {
    constructor() {
        // Positive Y = downward in DOM coordinate system
        this.gravity = { x: 0, y: 400, z: 0 }; // pixels per second squared
        this.bodies = [];
        this.staticBodies = [];
        this.restitution = 0.7; // Coefficient de rebond
        this.friction = 0.3;
    }

    addBody(body) {
        if (body.mass === 0) {
            this.staticBodies.push(body);
        } else {
            this.bodies.push(body);
        }
    }

    removeBody(body) {
        this.bodies = this.bodies.filter(b => b !== body);
        this.staticBodies = this.staticBodies.filter(b => b !== body);
    }

    step(deltaTime) {
        // Mettre à jour les corps dynamiques
        this.bodies.forEach(body => {
            // Appliquer la gravité
            body.velocity.x += this.gravity.x * deltaTime;
            body.velocity.y += this.gravity.y * deltaTime;
            body.velocity.z += this.gravity.z * deltaTime;

            // Mettre à jour la position
            body.position.x += body.velocity.x * deltaTime;
            body.position.y += body.velocity.y * deltaTime;
            body.position.z += body.velocity.z * deltaTime;

            // Mettre à jour la rotation
            body.angularVelocity.x *= 0.99; // damping
            body.angularVelocity.y *= 0.99;
            body.angularVelocity.z *= 0.99;

            body.rotation.x += body.angularVelocity.x * deltaTime;
            body.rotation.y += body.angularVelocity.y * deltaTime;
            body.rotation.z += body.angularVelocity.z * deltaTime;
        });

        // Vérifier les collisions
        this.bodies.forEach(body => {
            // Collision avec les corps statiques
            this.staticBodies.forEach(staticBody => {
                this.checkCollision(body, staticBody);
            });

            // Collision entre corps dynamiques
            this.bodies.forEach(otherBody => {
                if (body !== otherBody) {
                    this.checkCollision(body, otherBody);
                }
            });
        });
    }

    checkCollision(body1, body2) {
        // AABB collision detection simplifiée
        const b1 = {
            minX: body1.position.x - body1.size.x / 2,
            maxX: body1.position.x + body1.size.x / 2,
            minY: body1.position.y - body1.size.y / 2,
            maxY: body1.position.y + body1.size.y / 2,
            minZ: body1.position.z - body1.size.z / 2,
            maxZ: body1.position.z + body1.size.z / 2
        };

        const b2 = {
            minX: body2.position.x - body2.size.x / 2,
            maxX: body2.position.x + body2.size.x / 2,
            minY: body2.position.y - body2.size.y / 2,
            maxY: body2.position.y + body2.size.y / 2,
            minZ: body2.position.z - body2.size.z / 2,
            maxZ: body2.position.z + body2.size.z / 2
        };

        const colliding = (
            b1.minX < b2.maxX && b1.maxX > b2.minX &&
            b1.minY < b2.maxY && b1.maxY > b2.minY &&
            b1.minZ < b2.maxZ && b1.maxZ > b2.minZ
        );

        if (colliding && body1.mass > 0) {
            // Calculer la normale et la pénétration
            const overlapX = Math.min(b1.maxX - b2.minX, b2.maxX - b1.minX);
            const overlapY = Math.min(b1.maxY - b2.minY, b2.maxY - b1.minY);
            const overlapZ = Math.min(b1.maxZ - b2.minZ, b2.maxZ - b1.minZ);

            let normal = { x: 0, y: 0, z: 0 };
            let penetration = 0;

            // Trouver l'axe de plus petite pénétration
            if (overlapX < overlapY && overlapX < overlapZ) {
                penetration = overlapX;
                normal.x = body1.position.x < body2.position.x ? -1 : 1;
            } else if (overlapY < overlapZ) {
                penetration = overlapY;
                normal.y = body1.position.y < body2.position.y ? -1 : 1;
            } else {
                penetration = overlapZ;
                normal.z = body1.position.z < body2.position.z ? -1 : 1;
            }

            // Séparer les objets
            body1.position.x += normal.x * penetration;
            body1.position.y += normal.y * penetration;
            body1.position.z += normal.z * penetration;

            // Rebond (réflexion de la vélocité)
            const dotProduct = 
                body1.velocity.x * normal.x +
                body1.velocity.y * normal.y +
                body1.velocity.z * normal.z;

            if (dotProduct < 0) {
                body1.velocity.x -= (1 + this.restitution) * dotProduct * normal.x;
                body1.velocity.y -= (1 + this.restitution) * dotProduct * normal.y;
                body1.velocity.z -= (1 + this.restitution) * dotProduct * normal.z;

                // Ajouter une rotation aléatoire au rebond
                body1.angularVelocity.x += (Math.random() - 0.5) * 2;
                body1.angularVelocity.y += (Math.random() - 0.5) * 2;
                body1.angularVelocity.z += (Math.random() - 0.5) * 2;

                // Marquer comme collision récente
                body1.isColliding = true;
            }
        }
    }
}

class PhysicsBody {
    constructor(options = {}) {
        this.position = options.position || { x: 0, y: 0, z: 0 };
        this.velocity = options.velocity || { x: 0, y: 0, z: 0 };
        this.rotation = options.rotation || { x: 0, y: 0, z: 0 };
        this.angularVelocity = options.angularVelocity || { x: 0, y: 0, z: 0 };
        this.size = options.size || { x: 1, y: 1, z: 1 };
        this.mass = options.mass !== undefined ? options.mass : 1;
        this.isColliding = false;
    }
}
