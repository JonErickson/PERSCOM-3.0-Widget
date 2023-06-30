import * as Sentry from '@sentry/react'
import React, { useState } from 'react'
import useFetch from '../hooks/useFetch'
import { Loading } from '../components/Loading'
import { config } from '../constants'
import { Alert } from '../components/Alert'
import { Avatar, Card, Pagination, Tooltip } from 'flowbite-react'
import TimeAgo from 'react-timeago'
import cx from 'classnames'
import AvatarGroup from 'flowbite-react/lib/esm/components/Avatar/AvatarGroup'
import { FaceSmileIcon } from '@heroicons/react/24/outline'
import { createRequest, createHeaders } from '../hooks/useFetch'
import { useSearchParams } from 'react-router-dom'
import AuthService from '../services/AuthService'

function Newsfeed() {
  const [url, setUrl] = useState(config.newsfeed.API_URL)
  const [likes, setLikes] = useState()
  const [searchParams] = useSearchParams()
  const currentUserSub = AuthService.getSub(searchParams)

  const { data, meta, loading, error } = useFetch({
    url: url,
    dependencies: likes
  })

  const onLikeClick = (id) => {
    createRequest(config.newsfeed.API_URL + `${id}` + '/likes/attach', 'POST', createHeaders(searchParams), {
      resources: [currentUserSub]
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((response) => {
            throw new Error(response.error.message)
          })
        }
        response.json()
      })
      .then(() => {
        setLikes(Date.now())
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const onUnlikeClick = (id) => {
    createRequest(config.newsfeed.API_URL + `${id}` + '/likes/detach', 'DELETE', createHeaders(searchParams), {
      resources: [currentUserSub]
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((response) => {
            throw new Error(response.error.message)
          })
        }
        response.json()
      })
      .then(() => {
        setLikes(Date.now())
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const onPaginationClick = (page) => {
    const newUrl = new URL(url)
    newUrl.searchParams.set('page', page)

    setUrl(newUrl.href)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {error ? (
            <Alert message={error} type='failure' />
          ) : data && !!data.length ? (
            renderNewsFeed(data, meta, onPaginationClick, onLikeClick, onUnlikeClick, currentUserSub)
          ) : (
            <Alert message='No newsfeed items found. Please try again later.' />
          )}
        </>
      )}
    </>
  )
}

function renderNewsFeed(data, meta, onPaginationClick, onLikeClick, onUnlikeClick, currentUserSub) {
  const { current_page, last_page } = meta ?? {}

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex flex-col space-y-8'>
        {data.map((item) => renderNewsfeedItem(item, onLikeClick, onUnlikeClick, currentUserSub))}
      </div>
      {last_page > 1 && <Pagination showIcons currentPage={current_page} onPageChange={onPaginationClick} totalPages={last_page} />}
    </div>
  )
}

function renderNewsfeedItem(item, onLikeClick, onUnlikeClick, currentUserSub) {
  const {
    id,
    author,
    author_profile_photo,
    recipient,
    recipient_profile_photo,
    description,
    event,
    type,
    headline,
    text,
    subject,
    color,
    likes,
    created_at
  } = item

  return (
    <div className='flex flex-col space-y-2' key={id}>
      <div className='text-sm text-gray-500 px-1 flex flex-row items-center space-x-2'>
        {author_profile_photo ? (
          <Avatar stacked rounded img={author_profile_photo} alt={author} size='xs' />
        ) : (
          <Avatar stacked rounded alt={author} size='xs' />
        )}
        <div className='font-normal text-xs'>
          <span className='font-bold'>{author ?? 'User'}</span> {getTitle(event, type)} &#8226;{' '}
          <span className='text-gray-400'>
            <TimeAgo date={created_at} />
          </span>
        </div>
      </div>
      <Card
        target='_blank'
        className={cx('gap-2', {
          'ring-1 ring-blue-600 bg-blue-50 hover:bg-blue-100 text-blue-600': color === 'info',
          'ring-1 ring-red-600 bg-red-50 hover:bg-red-100': color === 'failure',
          'ring-1 ring-green-600 bg-green-50 hover:bg-green-100': color === 'success',
          'ring-1 ring-yellow-400 bg-yellow-50 hover:bg-yellow-100': color === 'warning'
        })}
      >
        <div className='flex flex-col space-y-4'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between space-y-2 sm:space-y-0'>
            <div className='flex flex-row space-x-2'>
              {recipient && (
                <>
                  {recipient_profile_photo ? (
                    <Avatar stacked rounded img={recipient_profile_photo} alt={recipient} size='xs' />
                  ) : (
                    <Avatar stacked rounded alt={recipient} size='xs' />
                  )}
                </>
              )}
              <h5 className='font-bold tracking-tight text-gray-900 dark:text-white'>{getHeadline(headline, description)}</h5>
            </div>
            <div className='text-xs text-gray-400'>{formatDate(created_at)}</div>
          </div>
          <div className='flex flex-col space-y-4'>
            {subject && <div className='text-sm text-gray-600 font-medium' dangerouslySetInnerHTML={{ __html: subject }}></div>}
            <div className='text-sm text-gray-500' dangerouslySetInnerHTML={{ __html: getText(text, description) }}></div>
            <div className='flex flex-row items-center space-x-2'>
              {newsfeedItemIsLiked(likes, currentUserSub) ? (
                <Tooltip content='Unlike'>
                  <div
                    className='w-7.5 rounded-full p-0.5 flex items-center border cursor-pointer border-blue-400 bg-blue-600 hover:bg-blue-500 border-blue-400 bg-blue-600 hover:bg-blue-500'
                    onClick={() => onUnlikeClick(id)}
                  >
                    <FaceSmileIcon className='h-6 w-6 text-gray-200' />
                  </div>
                </Tooltip>
              ) : (
                <Tooltip content='Like'>
                  <div
                    className='w-7.5 rounded-full p-0.5 flex items-center border cursor-pointer border-gray-300 bg-gray-100 hover:bg-gray-200'
                    onClick={() => onLikeClick(id)}
                  >
                    <FaceSmileIcon className='h-6 w-6 text-gray-400 hover:text-white' />
                  </div>
                </Tooltip>
              )}
              <AvatarGroup className='flex flex-wrap gap-2'>
                {likes &&
                  !!likes.length &&
                  likes.map(function (user) {
                    return (
                      <>
                        <Tooltip ey={user.id} content={user.name}>
                          <Avatar key={user.id} stacked rounded alt={user.name} size='xs' />
                        </Tooltip>
                      </>
                    )
                  })}
              </AvatarGroup>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

const getTitle = (event, type) => {
  switch (event) {
    case 'created':
      return `added a new ${type}`
    default:
      return `added a new message`
  }
}

const getHeadline = (headline, description) => {
  return headline ?? description
}

const getText = (text, description) => {
  return text ?? description ?? 'No content exists for this item.'
}

const newsfeedItemIsLiked = (likes, id) => {
  return (
    likes.filter(function (user) {
      return user.id == id
    }).length > 0
  )
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export default Sentry.withProfiler(Newsfeed)
