import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'

import { tmdbImage } from '@/api/tmdb'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardMedia } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { cn } from '@/lib/utils'

export type MovieCardData = {
  id: number
  title: string
  overview?: string
  poster_path?: string | null
  release_date?: string
  vote_average?: number
  vote_count?: number
  genre_ids?: number[]
}

export function MoviePosterCard({
  movie,
  layout = 'grid',
  genreName,
}: {
  movie: MovieCardData
  layout?: 'grid' | 'list'
  genreName?: string
}) {
  const list = layout === 'list'
  const rating = Number(movie.vote_average ?? 0)
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'
  const poster = tmdbImage(movie.poster_path, list ? 'w342' : 'w500')
  const href = `/movie/${movie.id}`

  return (
    <Card className={cn('h-full w-full', list ? 'flex-row' : 'flex-col')}>
      <Link to={href} tabIndex={-1} aria-hidden="true" className={cn(list ? 'relative w-[36%] max-w-40 shrink-0 self-stretch' : 'block')}>
        <CardMedia className={list ? 'aspect-[2/3] h-full min-h-40' : 'aspect-[2/3]'}>
          {poster ? (
            <img src={poster} alt="" loading="lazy" />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted text-xs text-muted-foreground">No image</div>
          )}
          {rating >= 8 && (
            <Badge variant="rated" className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
              Highest rated
            </Badge>
          )}
          <Badge className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
            {rating.toFixed(1)}
            <Star className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
          </Badge>
        </CardMedia>
      </Link>

      <div className={cn('flex min-w-0 flex-1 flex-col justify-between', list ? 'p-2.5 sm:px-4 sm:py-3' : 'p-3 pt-2')}>
        <Link to={href} className="space-y-1 rounded-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
          <h3 className={cn('font-montserrat leading-snug font-semibold text-gray-900 dark:text-gray-50', list ? 'line-clamp-2 text-sm sm:text-lg' : 'text-base')}>
            {movie.title}
            <span className="sr-only">, rated {rating.toFixed(1)} out of 10</span>
          </h3>
          {movie.overview && (
            <p className={cn('text-gray-600 dark:text-gray-400', list ? 'line-clamp-3 text-xs sm:text-sm' : 'line-clamp-2 text-xs leading-relaxed')}>
              {movie.overview}
            </p>
          )}
        </Link>

        <div className="flex flex-wrap gap-1.5 pt-2">
          <Chip>{year}</Chip>
          {genreName && <Chip>{genreName}</Chip>}
          {movie.vote_count ? <Chip>{movie.vote_count.toLocaleString()} votes</Chip> : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className="font-montserrat text-lg font-semibold tabular-nums">{rating.toFixed(1)}/10</p>
          <Link to={href} className={cn(buttonVariants({ size: 'sm' }), 'min-w-24 shrink-0')}>
            View details
          </Link>
        </div>
      </div>
    </Card>
  )
}
