import { useWindowScroll } from '@mantine/hooks'
import { ActionIcon, Affix, Transition } from '@mantine/core'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [scroll, scrollTo] = useWindowScroll()

  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <Transition
        transition="slide-up"
        mounted={scroll.y > 300}
        keepMounted={false}
        duration={300}
        timingFunction="ease"
      >
        {(styles) => (
          <ActionIcon
            style={styles}
            size="xl"
            radius="xl"
            variant="filled"
            color="indigo"
            onClick={() => scrollTo({ y: 0 })}
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  )
}