import type { Box } from '~/types/box'
import boxes from '~/data/boxes.json'

export const useBoxes = (): Box[] => boxes as Box[]
