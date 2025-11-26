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
        this.linearDamping = 0.98; // Damping for linear velocity
        this.angularDamping = 0.95; // Stronger damping for angular velocity
        this.sleepThreshold = 5; // Velocity below which objects "sleep"
        this.angularSleepThreshold = 0.1; // Angular velocity threshold for sleep
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
            // Skip sleeping bodies
            if (body.isSleeping) return;

            // Appliquer la gravité
            body.velocity.x += this.gravity.x * deltaTime;
            body.velocity.y += this.gravity.y * deltaTime;
            body.velocity.z += this.gravity.z * deltaTime;

            // Appliquer le damping linéaire
            body.velocity.x *= this.linearDamping;
            body.velocity.y *= this.linearDamping;
            body.velocity.z *= this.linearDamping;

            // Mettre à jour la position
            body.position.x += body.velocity.x * deltaTime;
            body.position.y += body.velocity.y * deltaTime;
            body.position.z += body.velocity.z * deltaTime;

            // Appliquer le damping angulaire (plus fort)
            body.angularVelocity.x *= this.angularDamping;
            body.angularVelocity.y *= this.angularDamping;
            body.angularVelocity.z *= this.angularDamping;

            // Mettre à jour la rotation
            body.rotation.x += body.angularVelocity.x * deltaTime;
            body.rotation.y += body.angularVelocity.y * deltaTime;
            body.rotation.z += body.angularVelocity.z * deltaTime;

            // Vérifier si le corps doit s'endormir (velocité très faible)
            const linearSpeed = Math.sqrt(
                body.velocity.x * body.velocity.x +
                body.velocity.y * body.velocity.y +
                body.velocity.z * body.velocity.z
            );
            const angularSpeed = Math.sqrt(
                body.angularVelocity.x * body.angularVelocity.x +
                body.angularVelocity.y * body.angularVelocity.y +
                body.angularVelocity.z * body.angularVelocity.z
            );

            // Si les deux vitesses sont très faibles, mettre le corps en sommeil
            if (linearSpeed < this.sleepThreshold && angularSpeed < this.angularSleepThreshold && body.isOnGround) {
                body.velocity = { x: 0, y: 0, z: 0 };
                body.angularVelocity = { x: 0, y: 0, z: 0 };
                body.isSleeping = true;
            }
        });

        // Vérifier les collisions
        this.bodies.forEach(body => {
            if (body.isSleeping) return;

            // Collision avec les corps statiques
            this.staticBodies.forEach(staticBody => {
                this.checkCollision(body, staticBody);
            });

            // Collision entre corps dynamiques
            this.bodies.forEach(otherBody => {
                if (body !== otherBody && !otherBody.isSleeping) {
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
            // Réveiller le corps s'il dormait
            body1.isSleeping = false;
            
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
                // Si collision avec le sol (normal.y = -1), marquer comme sur le sol
                if (normal.y === -1 && body2.mass === 0) {
                    body1.isOnGround = true;
                }
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

                // Appliquer la friction au rebond (réduire la vitesse)
                body1.velocity.x *= (1 - this.friction);
                body1.velocity.z *= (1 - this.friction);

                // Ajouter une petite rotation au rebond (beaucoup plus faible)
                const impactStrength = Math.abs(dotProduct) / 100;
                body1.angularVelocity.x += (Math.random() - 0.5) * impactStrength;
                body1.angularVelocity.y += (Math.random() - 0.5) * impactStrength;
                body1.angularVelocity.z += (Math.random() - 0.5) * impactStrength;

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
        this.isSleeping = false;
        this.isOnGround = false;
    }
}
