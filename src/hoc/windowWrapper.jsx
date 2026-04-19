// import useWindowStore from "#store/window"
// import { gsap } from "gsap"
// // import { Draggable } from "gsap/all"
// import { Draggable } from "gsap/draggable"
// import { useGSAP } from "@gsap/react"

// gsap.registerPlugin(Draggable, useGSAP)

// import React, { useLayoutEffect, useRef } from "react"

// const windowwrapper = (Component, windowKey) => {
//   const Wrapped = (props) => {
//     const { focusWindow, windows } = useWindowStore()
//     const { isOpen, zIndex } = windows[windowKey]
//     const ref = useRef(null)

//     useGSAP(() => {
//       const el = ref.current
//       if (!el || !isOpen) return

//       el.style.display = "block"
//       gsap.fromTo(
//         el,
//         { scale: 0.8, opacity: 0, y: 40 },
//         { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
//       )
//     }, [isOpen])

//     useGSAP(() => {
//       const el = ref.current
//       if (!el) return

//       Draggable.create(el, { onPress: () => focusWindow(windowKey) })
//     }, [])

//     useLayoutEffect(() => {
//       const el = ref.current
//       if (!el) return

//       el.style.display = isOpen ? "block" : "none"
//     }, [isOpen])

//     return (
//       <section id={windowKey} ref={ref} style={{ zIndex }} className="absolute">
//         <Component {...props} />
//       </section>
//     )
//   }
//   Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`
//   return Wrapped
// }

// export default windowwrapper

import useWindowStore from "#store/window"
import { gsap } from "gsap"
import { Draggable } from "gsap/draggable"
import { useGSAP } from "@gsap/react"
import React, { useLayoutEffect, useRef } from "react"

gsap.registerPlugin(Draggable, useGSAP)

const windowwrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore()
    const { isOpen, zIndex } = windows[windowKey]
    const ref = useRef(null)

    useGSAP(() => {
      const el = ref.current
      if (!el) return

      if (isOpen) {
        // 1. Force display block so animation is visible
        el.style.display = "block"

        // 2. Run the entrance animation
        gsap.fromTo(
          el,
          { scale: 0.8, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        )

        // 3. Initialize Draggable only when open
        const [instance] = Draggable.create(el, {
          onPress: () => focusWindow(windowKey),
          bounds: "body", // Highly recommended for a macOS feel
        })

        // Cleanup: kill the draggable when window closes/unmounts
        return () => instance[0].kill()
      } else {
        // Hide it when not open
        el.style.display = "none"
      }
    }, [isOpen]) // Only run when isOpen changes

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{ zIndex, display: "none" }} // Start hidden
        className="absolute"
      >
        <Component {...props} />
      </section>
    )
  }

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`
  return Wrapped
}

export default windowwrapper
