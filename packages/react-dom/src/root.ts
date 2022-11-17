import {
	updateContainer,
	createContainer
} from 'react-reconciler/src/fiberReconciler'
import { ReactElement } from 'shared/ReactTypes'

import { Container } from './hostConfig'

const createRoot = (container: Container) => {
	const root = createContainer(container)
	return {
		render(element: ReactElement) {
			updateContainer(element, root)
		}
	}
}

export default createRoot
