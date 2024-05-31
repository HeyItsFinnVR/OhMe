// https://kit.svelte.dev/docs/hooks
// "'Hooks' are app-wide functions you declare that SvelteKit will call in response to specific events..."

// The `event` object represents the request clients make to the server
// Data can be passed down to server-side `load` functions by populating the `event.locals` object

// The `resolve` function renders the route and generates a `Response` for the client

// https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks
// "A helper function for sequencing multiple handle calls in a middleware-like manner."
import { sequence } from "@sveltejs/kit/hooks"

// Import settings
import { settings }  from "$lib/settings"



// Import prisma client instance to modify db
import { client as prismaClient } from "$lib/server/prisma"

// Define hook to handle client authentication
const authHandle = async ({ event, resolve }) => {
    // Get user and session id from client's cookies
    const userId = event.cookies.get("user")
    const sessionId = event.cookies.get("session")

    // If client does not have both cookies
    if (!userId || !sessionId) {
        // Set both local objects to null
        event.locals.user = null
        event.locals.session = null

        // Return response
        return resolve(event)
    }

    // Check if Session entry with matching id exists in db
    // Only get the Session if it has a User relation with a matching id
    // This means in order for a malicious client to set their own cookie values,
    // they would have to correctly guess a valid Session id and the corresponding User id,
    // with random UUIDs this should be very secure.
    try {
        let dbResponse = await prismaClient.Session.findUnique({
            // Set filter fields
            where: {
                id: sessionId,
                userId: userId
            },
            // Set Session return fields
            include: {
                user: {
                    include: {
                        email: true,
                        password: true,
                        sessions: true,
                        friended: true,
                        friendOf: true
                    }
                }
            }
        })
        // If `dbResponse` is not null (Matching Session found)
        if (dbResponse) {
            var { user, ...session} = dbResponse
        }
    } catch (err) {
        // Catch errors
        console.error("Error at hook.server.js")
        console.error(err)
    }

    // If `session` undefined
    if (!session) {
        // Delete client's cookies
        await event.cookies.delete("session", {
            path: "/",
            secure: false
        })
        await event.cookies.delete("user", {
            path: "/",
            secure: false
        })

        // Set both local objects to null
        event.locals.user = null
        event.locals.session = null

        // Return response
        return resolve(event)
    }

    // If Session is expired
    if (session.expiresAt < new Date()) {
        // Delete client's cookies
        await event.cookies.delete("session", {
            path: "/",
            secure: false
        })
        await event.cookies.delete("user", {
            path: "/",
            secure: false
        })

        // Set both local objects to null
        event.locals.user = null
        event.locals.session = null

        // Return response
        return resolve(event)
    }

    // Get date `session.renewalLead` number of days from now
    const renewBefore = new Date()
    renewBefore.setDate(renewBefore.getDate() + settings.session.renewalLead)

    // If Session expires sooner than `renewBefore` date
    if (session.expiresAt < renewBefore) {
        // Get date `session.duration` number of days from now
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + settings.session.duration)

        // Extend `expiresAt` date
        try {
            await prismaClient.Session.update({
                // Set filter fields
                where: {
                    id: sessionId
                },
                // Set update fields
                data: {
                    expiresAt: expiryDate
                }
            })
            // Update `session` object
            session.expiresAt = expiryDate
        } catch (err) {
            // Catch errors
            console.error("Error at hook.server.js")
            console.error(err)
        }
    }

    // Set both local objects to corresponding values
    event.locals.user = user
    event.locals.session = session

    // Return response
    return resolve(event)
}



// https://kit.svelte.dev/docs/load#redirects
// "To redirect users, use the redirect helper from @sveltejs/kit to specify the location
//  to which they should be redirected..."
import { redirect } from "@sveltejs/kit"

const privateGuard = async ({ event, resolve }) => {
    // Get if the route the client is requesting is in the private group
    const privateRoute = event.route.id.startsWith("/(main)/(private)/")

    // If the client requesting a private route and is not logged in
    if (privateRoute && !event.locals.session) {
        // Redirect the client with search params
        redirect(302, `${settings.urls.login}?protected=login&redirectTo=${event.url.pathname+event.url.search}`)
    }

    // Allow the client to access the route
    return await resolve(event)
}

// Export handle sequence to be run on events
export const handle = sequence(authHandle, privateGuard)