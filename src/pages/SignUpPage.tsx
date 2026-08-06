import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import checkCircleIcon from '../assets/icons/check-circle.svg'
import Button from '../components/Button'
import HomeIndicator from '../components/HomeIndicator'
import LogoImage from '../components/LogoImage'
import MobileScreen from '../components/MobileScreen'
import PasswordField from '../components/PasswordField'
import TextField from '../components/TextField'
import TopAppBar from '../components/TopAppBar'

/** Figma `A-02 회원가입` (node 5:3109) */
export default function SignUpPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const passwordMatched =
    password.length > 0 && password === passwordConfirm

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <MobileScreen>
      <TopAppBar onBack={() => navigate(-1)} />
      <LogoImage />

      <h1 className="text-[32px] font-extrabold leading-none text-black">
        회원가입
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-start gap-[25px]"
      >
        <TextField
          label="이름"
          autoComplete="name"
          placeholder="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

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
          autoComplete="new-password"
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="flex w-full flex-col items-start gap-[35px]">
          <TextField
            label="비밀번호 확인"
            type="password"
            autoComplete="new-password"
            placeholder="password"
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            trailing={
              passwordMatched ? (
                <img
                  src={checkCircleIcon}
                  alt="비밀번호 일치"
                  width={20}
                  height={20}
                  className="block h-[20px] w-[20px]"
                />
              ) : null
            }
          />

          <Button type="submit">회원가입</Button>
        </div>
      </form>

      <HomeIndicator />
    </MobileScreen>
  )
}
