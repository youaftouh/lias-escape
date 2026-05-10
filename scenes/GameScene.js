import { Scene, manager } from '@tialops/maki'
import GardenScene from './GardenScene.js'

export default class GameScene extends Scene {
    constructor() {
        super('GameScene')
    }

    init(data) {
        this.startX = data.startX || 400
        this.startY = data.startY || 400
    }

    preload() {
        this._makiPlayers = []
        super.preload()
        this.lia = this.maki.player('lia')
        manager.map(this, 'room')
        manager.preload(this)
    }

    create() {
        super.create()
        manager.create(this)

        this.add.text(780, 20, 'The Room', { fontSize: '24px', fill: '#ffffff', fontFamily: 'monospace', stroke: '#000000', strokeThickness: 4 })
            .setOrigin(1, 0)
            .setScrollFactor(0)
            .setDepth(100)

        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        })

        const origKeys = this.lia.keys;
        const wasd = this.wasd;
        this.lia.keys = {
            get left() { return { isDown: origKeys.left.isDown || wasd.left.isDown } },
            get right() { return { isDown: origKeys.right.isDown || wasd.right.isDown } },
            get up() { return { isDown: origKeys.up.isDown || wasd.up.isDown } },
            get down() { return { isDown: origKeys.down.isDown || wasd.down.isDown } }
        }

        this.lia.sprite.setPosition(this.startX, this.startY)
        this.physics.add.collider(this.lia.sprite, manager.getWallGroup(this, 'room'))

        if (!this.scene.get('GardenScene')) {
            this.scene.add('GardenScene', GardenScene, false)
        }
    }

    update() {
        this.maki.move(this.lia)

        // Transition to Garden when entering bottom doors
        if (this.lia.sprite.y > 500) {
            this.scene.stop('GameScene')
            this.scene.start('GardenScene', { startX: this.lia.sprite.x, startY: 160 })
        }
    }
}
