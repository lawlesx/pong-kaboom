import kaboom from 'kaboom'
import { useEffect, useRef } from 'react'

const usePongKaboom = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const k = kaboom({
      // if you don't want to import to the global namespace
      global: false,
      // if you don't want kaboom to create a canvas and insert under document.body
      canvas: canvasRef.current as HTMLCanvasElement,
      background: [0, 0, 0],
    })

    k.loadSound('bg', '/audio/everdream.mp3')

    k.scene('start', () => {
      // Welcome text
      k.add([
        k.text('Welcome to Pong', {
          size: 34,
        }),
        k.pos(k.width() / 2, k.height() / 2 - 100),
        k.anchor('center'),
      ])

      k.add([
        k.text('Press any key to start', {
          size: 20,
        }),
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor('center'),
      ])

      k.onKeyPress(() => {
        k.play('bg', {
          loop: true,
        })
        k.go('main')
      })
    })

    k.go('start')

    // Score
    let score = 0

    k.scene('main', () => {
      const slider = k.add([
        k.rect(k.width() / 4, 30, {
          fill: true,
          radius: 10,
        }),
        k.color(167, 128, 231),
        k.pos(k.width() / 2, k.height() - 50),
        k.area(),
        k.body({
          isStatic: true,
        }),
        k.anchor('center'),
        'slider',
      ])

      k.onKeyDown('left', () => {
        slider.move(-500, 0)
        if (slider.pos.x < 0) {
          slider.pos.x = 0
        }
      })

      k.onKeyDown('right', () => {
        slider.move(500, 0)
        if (slider.pos.x > k.width()) {
          slider.pos.x = k.width()
        }
      })

      // Add walls
      k.add([k.rect(k.width(), 5), k.color(0, 0, 0), k.pos(0, 0), k.area(), 'topWall', 'wall'])
      k.add([k.rect(k.width(), 5), k.color(0, 0, 0), k.pos(0, k.height() - 5), k.area(), 'bottomWall', 'wall'])
      k.add([k.rect(5, k.height()), k.color(0, 0, 0), k.pos(0, 0), k.area(), 'leftWall', 'wall'])
      k.add([k.rect(5, k.height()), k.color(0, 0, 0), k.pos(k.width() - 5, 0), k.area(), 'rightWall', 'wall'])

      const ball = k.add([
        k.circle(14),
        k.color(255, 255, 255),
        k.pos(k.width() / 2, k.height() / 2),
        k.area(),
        k.body(),
        k.anchor('center'),
      ])

      k.wait(1, () => {
        ball.vel = k.vec2(100, 200)
      })

      ball.onCollide('slider', () => {
        const speedFactor = 1.1
        ball.vel = k.vec2(ball.vel.x * speedFactor, -ball.vel.y * speedFactor)

        // Increase score
        score++
        scoreText.text = score.toString()
      })

      ball.onCollide('topWall', () => {
        ball.vel = k.vec2(ball.vel.x, -ball.vel.y)
      })

      ball.onCollide('leftWall', () => {
        ball.vel = k.vec2(-ball.vel.x, ball.vel.y)
      })

      ball.onCollide('rightWall', () => {
        ball.vel = k.vec2(-ball.vel.x, ball.vel.y)
      })

      // Destroy ball and show game over
      ball.onCollide('bottomWall', () => {
        ball.destroy()
        k.go('gameOver')
      })

      // Give ball initial velocity
      k.onUpdate(() => {
        ball.move(ball.vel)

        // Prevent ball from going out of bounds
        if (ball.pos.x < 0) {
          ball.pos.x = 0
          ball.vel = k.vec2(-ball.vel.x, ball.vel.y)
        }

        if (ball.pos.x > k.width()) {
          ball.pos.x = k.width()
          ball.vel = k.vec2(-ball.vel.x, ball.vel.y)
        }

        if (ball.pos.y < 0) {
          ball.pos.y = 0
          ball.vel = k.vec2(ball.vel.x, -ball.vel.y)
        }

        if (ball.pos.y > k.height()) {
          ball.pos.y = k.height()
          ball.vel = k.vec2(ball.vel.x, -ball.vel.y)
        }
      })

      const scoreText = k.add([
        k.text('0', {
          size: 48,
        }),
        k.pos(k.width() / 2, 50),
        k.fixed(),
        k.anchor('center'),
        'score',
      ])
    })

    k.scene('gameOver', () => {
      k.add([
        k.text(`Game Over \nScore: ${score}`, {
          size: 32,
        }),
        k.pos(k.width() / 2, k.height() / 2),
        k.anchor('center'),
      ])

      // Play again
      k.add([
        k.text('Press any key to play again', {
          size: 24,
        }),
        k.pos(k.width() / 2, k.height() / 2 + 100),
        k.anchor('center'),
      ])

      k.onKeyPress(() => {
        score = 0
        k.go('main')
      })
    })
  }, [])

  return {
    canvasRef,
  }
}

export default usePongKaboom
