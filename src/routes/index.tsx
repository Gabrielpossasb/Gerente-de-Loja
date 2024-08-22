import { NavigationContainer } from '@react-navigation/native'
import { DataUserProvider } from '../hook/useDataUser'
import { SelectTrilhaProvider } from '../hook/useSelectTrilha'
import StackRoutes from './stack.routes'

export default function Routes() {

    return (
        <NavigationContainer independent={true}>
            <DataUserProvider>
                <SelectTrilhaProvider>
                    <StackRoutes />
                </SelectTrilhaProvider>
            </DataUserProvider>
        </NavigationContainer>
    )
}