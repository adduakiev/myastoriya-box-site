export const useFilterSheet = () => {
  const isOpen = useState('filterSheetOpen', () => false)
  const open = () => {
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
