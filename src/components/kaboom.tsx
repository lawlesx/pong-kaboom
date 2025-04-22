'use client'
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
        k.go('main')
      })

      k.onTouchStart(() => {
        k.go('main')
      })
    })

    k.go('start')

    // Score
    let score = 0

    let paddleHits = 0

    k.scene('main', () => {
      const slider = k.add([
        k.rect(k.width() / 4, 30, {
          fill: true,
          radius: 10,
        }),
        k.color(167, 128, 231),
        k.pos(k.width() / 2, k.height() - 20),
        k.area(),
        k.body({
          isStatic: true,
        }),
        k.anchor('center'),
        'slider',
      ])

      const getSliderSpeed = () => {
        // Base speed: 500
        const baseSpeed = 500
        // Increase by 4% per hit, capped at 2x base speed
        const speedMultiplier = Math.min(2.0, 1 + paddleHits * 0.04)
        return baseSpeed * speedMultiplier
      }

      k.onKeyDown('left', () => {
        const speed = getSliderSpeed()
        slider.move(-speed, 0)
        if (slider.pos.x < 0) {
          slider.pos.x = 0
        }
      })

      k.onKeyDown('right', () => {
        const speed = getSliderSpeed()
        slider.move(speed, 0)
        if (slider.pos.x > k.width()) {
          slider.pos.x = k.width()
        }
      })

      // Touch controls - we'll keep the position-based approach but add sensitivity
      let lastTouchX = 0
      k.onTouchMove((pos) => {
        // Adjust touch sensitivity based on score
        const sensitivity = 1 + score * 0.002 // Increase sensitivity with score

        if (lastTouchX !== 0) {
          // Calculate movement based on touch delta and sensitivity
          const touchDelta = (pos.x - lastTouchX) * sensitivity
          slider.pos.x += touchDelta

          // Keep paddle within bounds
          if (slider.pos.x < 0) slider.pos.x = 0
          if (slider.pos.x > k.width()) slider.pos.x = k.width()
        }

        lastTouchX = pos.x
      })

      k.onTouchEnd(() => {
        lastTouchX = 0 // Reset when touch ends
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
        k.play('bg', {
          loop: true,
        })
      })

      ball.onCollide('slider', () => {
        // Calculate where the ball hit the slider (normalized between -1 and 1)
        const sliderWidth = k.width() / 4
        const hitPos = (ball.pos.x - slider.pos.x) / (sliderWidth / 2)

        // Ensure minimum horizontal angle (even for center hits)
        // Use a non-linear mapping to create more natural bounces
        const minAngle = Math.PI / 12 // Minimum 15 degree angle
        const angle = Math.sign(hitPos) * Math.max(minAngle, Math.abs((hitPos * Math.PI) / 3))

        // Add small random variation to avoid predictable patterns
        const finalAngle = angle + (Math.random() * 0.1 - 0.05)

        // Calculate speed based on current velocity
        const speed = Math.sqrt(ball.vel.x * ball.vel.x + ball.vel.y * ball.vel.y)
        const speedFactor = 1 + Math.min(0.5, score * 0.02) // Increase speed by 2% for every 10 points (up to 50% max)
        const newSpeed = speed * speedFactor

        // Set new velocity based on angle and speed
        ball.vel = k.vec2(newSpeed * Math.sin(finalAngle), -newSpeed * Math.cos(finalAngle))

        // Add paddle momentum if it's moving (keep as is)
        if (k.isKeyDown('left')) {
          ball.vel.x -= 50
        }
        if (k.isKeyDown('right')) {
          ball.vel.x += 50
        }

        // Increase score
        score++
        scoreText.text = score.toString()

        paddleHits++ // Increment paddle hit count
      })

      ball.onCollide('topWall', () => {
        ball.vel = k.vec2(
          ball.vel.x * (1 + (Math.random() * 0.1 - 0.05)), // Small random factor
          -ball.vel.y
        )
      })

      ball.onCollide('leftWall', () => {
        ball.vel = k.vec2(
          -ball.vel.x,
          ball.vel.y * (1 + (Math.random() * 0.1 - 0.05)) // Small random factor
        )
      })

      ball.onCollide('rightWall', () => {
        ball.vel = k.vec2(
          -ball.vel.x,
          ball.vel.y * (1 + (Math.random() * 0.1 - 0.05)) // Small random factor
        )
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

      k.onTouchStart(() => {
        score = 0
        k.go('main')
      })
    })
  }, [])

  return {
    canvasRef,
  }
}

const Kaboom = () => {
  const { canvasRef } = usePongKaboom()

  return <canvas ref={canvasRef} />
}

export default Kaboom
