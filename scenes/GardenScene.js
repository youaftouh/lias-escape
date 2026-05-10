import { Scene, manager } from '@tialops/maki'

export default class GardenScene extends Scene {
    constructor() {
        super('GardenScene')
    }

    init(data) {
        this.startX = data.startX || 400
        this.startY = data.startY || 400
    }

    preload() {
        this._makiPlayers = []
        super.preload()
        this.lia = this.maki.player('lia')

        // Preload garden assets
        this.load.image('plant', 'assets/random/plants.png')
        this.load.image('flower', 'assets/random/flower.png')

        manager.map(this, 'garden')
        manager.preload(this)
    }

    create() {
        super.create()
        manager.create(this)

        this.add.text(780, 20, 'The Garden', { fontSize: '24px', fill: '#ffffff', fontFamily: 'monospace', stroke: '#000000', strokeThickness: 4 })
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

        // Add a green tint over the floor area to look like grass
        const grass = this.add.rectangle(312, 336, 208, 384, 0x2d5a27, 0.5)
        grass.setDepth(0.1)

        // Arrange plants and flowers in a uniform 5x8 grid
        for (let i = 0; i < 40; i++) {
            const col = i % 5
            const row = Math.floor(i / 5)
            const x = 230 + col * 40
            const y = 180 + row * 45
            // Create a nice checkerboard pattern of flowers and plants
            const isFlower = (col + row) % 2 === 0
            this.add.image(x, y, isFlower ? 'flower' : 'plant').setDepth(0.2)
        }

        this.lia.sprite.setPosition(this.startX, this.startY)
        this.physics.add.collider(this.lia.sprite, manager.getWallGroup(this, 'garden'))
    }

    update() {
        this.maki.move(this.lia)

        // Transition back to Room when going up
        if (this.lia.sprite.y < 140) {
            this.scene.stop('GardenScene')
            this.scene.start('GameScene', { startX: this.lia.sprite.x, startY: 480 })
        }

        // Prevent walking off the bottom of the Garden
        if (this.lia.sprite.y > 500) {
            this.lia.sprite.y = 500
        }
    }
}
