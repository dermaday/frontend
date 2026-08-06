import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import HomeIndicator from '../components/HomeIndicator'
import LogoImage from '../components/LogoImage'
import MobileScreen from '../components/MobileScreen'
import PasswordField from '../components/PasswordField'
import SocialLogin from '../components/SocialLogin'
import TextField from '../components/TextField'
import TopAppBar from '../components/TopAppBar'

/** Figma `A-01 로그인` (node 5:3) */
export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <MobileScreen>
      <TopAppBar onBack={() => navigate(-1)} />
      <LogoImage />

      <h1 className="text-[32px] font-extrabold leading-none text-black">
        로그인
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-start gap-[25px]"
      >
        <TextField
          label="이메일"
          type="email"
          autoComplete="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <PasswordField
          label="비밀번호"
          autoComplete="current-password"
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="flex h-[22px] w-full shrink-0 items-center justify-center gap-[5px] pb-[2px] pt-[3px] text-[14px] leading-none">
          <button type="button" className="text-black">
            아이디 찾기
          </button>
          <span className="text-gray-500">|</span>
          <button type="button" className="text-black">
            비밀번호 찾기
          </button>
          <span className="text-gray-500">|</span>
          <Link to="/signup" className="text-black">
            회원가입
          </Link>
        </div>

        <Button type="submit">로그인</Button>
      </form>

      <SocialLogin />

      <HomeIndicator />
    </MobileScreen>
  )
}
