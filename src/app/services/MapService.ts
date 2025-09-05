import request from 'axios'
import type { AppDispatch } from '../providers/store'
import { getCurrentUserNotification } from '../providers/reducers/UserSlice'

export type GeocodeResult = {
	country?: string
	city?: string
	address?: string
}

// Reverse geocode using OpenStreetMap Nominatim (no API key required).
// Note: This is best-effort and should be rate-limited in production.
export async function reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
	try {
		const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`

		type NominatimResponse = {
			address?: Record<string, string>
			display_name?: string
		}

		const { data } = await request.get<NominatimResponse>(url, {
			// Can't set User-Agent from browsers; rely on default headers
			headers: { Accept: 'application/json' },
		})

		const addr = data?.address ?? {}

		const city =
			addr.city ||
			addr.town ||
			addr.village ||
			addr.hamlet ||
			addr.municipality ||
			addr.state_district ||
			addr.state ||
			addr.county

		const road = addr.road || addr.pedestrian || addr.footway || addr.path
		const house = addr.house_number
		const line = [road, house].filter(Boolean).join(' ').trim()
		const address: string | undefined = data?.display_name || [line, city, addr.postcode, addr.country].filter(Boolean).join(', ')

		return {
			country: addr.country,
			city,
			address,
		}
		} catch {
		// Swallow errors for the direct-call API to keep existing behavior
		return {}
	}
}

// Redux-thunk friendly version mirroring ClubService style.
// Usage: dispatch(getReverseGeocode(lat, lng)) -> Promise<GeocodeResult>
export const getReverseGeocode = (lat: number, lng: number) => async (dispatch: AppDispatch) => {
	try {
		const result = await reverseGeocode(lat, lng)
		return result
	} catch (error) {
		let errorMessage = ''
		if (request.isAxiosError(error) && error.response) {
			errorMessage = 'Failed to resolve address from map position'
			dispatch(getCurrentUserNotification(errorMessage))
		}
		throw error
	}
}

