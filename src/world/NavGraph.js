import * as THREE from 'three';

/**
 * Navigation Graph & A* Pathfinding for Enemy AI
 * - Floor elevation penalty so waypoints on different floors aren't picked mistakenly
 * - Fast A* search
 */
export class NavGraph {
  constructor() {
    this.nodes = [];
  }

  addNode(id, x, y, z) {
    const node = {
      id,
      pos: new THREE.Vector3(x, y, z),
      neighbors: []
    };
    this.nodes.push(node);
    return node;
  }

  connect(idA, idB) {
    const nodeA = this.nodes.find(n => n.id === idA);
    const nodeB = this.nodes.find(n => n.id === idB);
    if (nodeA && nodeB) {
      if (!nodeA.neighbors.includes(idB)) nodeA.neighbors.push(idB);
      if (!nodeB.neighbors.includes(idA)) nodeB.neighbors.push(idA);
    }
  }

  getClosestNode(position) {
    let closest = null;
    let minDist = Infinity;

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const dx = node.pos.x - position.x;
      // 4x vertical penalty ensures we don't pick nodes on upper/lower floors over current floor nodes
      const dy = (node.pos.y - position.y) * 4.0;
      const dz = node.pos.z - position.z;
      const distSq = dx * dx + dy * dy + dz * dz;

      if (distSq < minDist) {
        minDist = distSq;
        closest = node;
      }
    }
    return closest;
  }

  findPath(startPos, endPos) {
    const startNode = this.getClosestNode(startPos);
    const endNode = this.getClosestNode(endPos);

    if (!startNode || !endNode) return [endPos.clone()];
    if (startNode.id === endNode.id) return [endPos.clone()];

    // Standard A* search
    const openSet = [startNode];
    const cameFrom = new Map();

    const gScore = new Map();
    gScore.set(startNode.id, 0);

    const fScore = new Map();
    fScore.set(startNode.id, startNode.pos.distanceTo(endNode.pos));

    while (openSet.length > 0) {
      let current = openSet[0];
      let lowestF = fScore.get(current.id) || Infinity;
      let currentIndex = 0;

      for (let i = 1; i < openSet.length; i++) {
        const f = fScore.get(openSet[i].id) || Infinity;
        if (f < lowestF) {
          lowestF = f;
          current = openSet[i];
          currentIndex = i;
        }
      }

      if (current.id === endNode.id) {
        // Reconstruct path
        const path = [endPos.clone()];
        let curr = current;
        while (cameFrom.has(curr.id)) {
          path.unshift(curr.pos.clone());
          curr = cameFrom.get(curr.id);
        }
        return path;
      }

      openSet.splice(currentIndex, 1);

      for (let j = 0; j < current.neighbors.length; j++) {
        const neighborId = current.neighbors[j];
        const neighbor = this.nodes.find(n => n.id === neighborId);
        if (!neighbor) continue;

        const tentativeG = (gScore.get(current.id) || 0) + current.pos.distanceTo(neighbor.pos);

        if (tentativeG < (gScore.get(neighbor.id) ?? Infinity)) {
          cameFrom.set(neighbor.id, current);
          gScore.set(neighbor.id, tentativeG);
          fScore.set(neighbor.id, tentativeG + neighbor.pos.distanceTo(endNode.pos));

          if (!openSet.some(n => n.id === neighbor.id)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    // Direct fallback
    return [endPos.clone()];
  }
}
