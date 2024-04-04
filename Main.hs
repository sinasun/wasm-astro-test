{-# LANGUAGE ForeignFunctionInterface #-}

module Hello where

fib :: Int -> Int
fib n | n <= 1    = n
      | otherwise = fib (n - 1) + fib (n - 2)

foreign export ccall fib :: Int -> Int
