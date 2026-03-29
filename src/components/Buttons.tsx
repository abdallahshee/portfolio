import { Button, type ButtonProps } from '@mantine/core';
function FacebookIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      fill="currentColor"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path d="M279.14 288l14.22-92.66h-88.91V127.3c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.43 0 225.36 0c-73.22 0-121.09 44.38-121.09 124.72V195.3H22.89V288h81.38v224h100.17V288z" />
    </svg>
  )
}

function GithubIcon(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
      0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756
      -1.089-.745.082-.73.082-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 
      3.495.998.108-.776.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 
      0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 
      0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013.003-.404 
      c1.02.005 2.045.138 3.003.404 
      2.28-1.552 3.285-1.23 3.285-1.23 
      .645 1.653.24 2.873.12 3.176 
      .765.84 1.23 1.91 1.23 3.22 
      0 4.61-2.805 5.625-5.475 5.92 
      .435.375.81 1.096.81 2.215 
      0 1.6-.015 2.89-.015 3.285 
      0 .315.21.69.825.57C20.565 21.795 24 17.297 24 12 
      24 5.373 18.627 0 12 0z" />
    </svg>
  )
}

function GoogleIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 256 262"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      <path
        fill="#4285F4"
        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
      />
      <path
        fill="#34A853"
        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
      />
      <path
        fill="#FBBC05"
        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
      />
      <path
        fill="#EB4335"
        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
      />
    </svg>
  );
}

export function GoogleButton(
  props: ButtonProps & React.ComponentPropsWithoutRef<'button'>
) {
  return (
    <Button
      leftSection={<GoogleIcon />}
      variant="default"
      radius="xl"
      className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
      {...props}
    />
  )
}

export function GithubButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <Button leftSection={<GithubIcon />} variant="default" {...props} />);
}

export function FacebookButton(
  props: ButtonProps & React.ComponentPropsWithoutRef<'button'>
) {
  return (
    <Button
      leftSection={<FacebookIcon />}
      color="blue"
      variant="light"
      {...props}
    />
  )
}