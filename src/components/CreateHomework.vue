<template>
  <div class="main">
    <div class="block header">
      新增作业
      <a-space :size="4">
        <a-button type="ghost" shape="circle" @click="themeChanged">
          <img v-if="theme === 'dark'" src="@/assets/svg/sun.svg" width="20" height="20" />
          <img v-else src="@/assets/svg/moon.svg" width="20" height="20" />
        </a-button>

        <a-button type="ghost" shape="circle" :icon="h(CloseOutlined)" />
      </a-space>
    </div>
    <div class="block">
      <!-- a-row a-col 不好用 -->
      <a-row class="row">
        <a-col flex="100px" class="left"><span class="title required">选择分组方案</span></a-col>
        <a-col flex="auto" class="right">
          <a-select
            placeholder="请选择分组方案"
            ref="select"
            show-search
            :filter-option="groupFilterOption"
            style="width: 100%"
            v-model:value="groupValue"
            :options="groupOptions"
          ></a-select>
        </a-col>
      </a-row>

      <a-row class="row">
        <a-col flex="100px" class="left"><span class="title required">标题</span></a-col>
        <a-col flex="auto" class="right">
          <a-input v-model:value="homeworkTitle" placeholder="" :maxlength="20" showCount status />
        </a-col>
      </a-row>

      <a-row class="row">
        <a-col flex="100px" class="left"><span class="title">作业附件</span></a-col>
        <a-col flex="auto" class="right">
          <div>
            <a-upload
              accept="audio/*,video/*,image/*"
              v-model:file-list="fileList"
              name="avatar"
              list-type="text"
              :show-upload-list="true"
              :before-upload="beforeUpload"
              @change="handleChange"
            >
              <div class="fileUpload">
                <img src="@/assets/svg/add-file.svg" width="24" height="24" />
                <span>添加文件</span>
              </div>
            </a-upload>
          </div>
        </a-col>
      </a-row>

      <a-row class="row">
        <a-col flex="100px" class="left"></a-col>
        <a-col flex="auto" class="right">
          <a-space :size="24" class="addOther">
            <a-space :size="8"><PlusOutlined /><span>说明</span></a-space>
            <a-space :size="8"><PlusOutlined /><span>知识点</span></a-space>
            <a-space :size="8"><PlusOutlined /><span>OBE指标</span></a-space>
          </a-space>
        </a-col>
      </a-row>
    </div>
    <div class="block">
      <div class="row">
        <div class="left"><span class="title">作业形式</span></div>
        <div class="right">
          <a-radio-group v-model:value="homeworkType">
            <!-- <s-space :align="'end'" :size="32">  not working-->
            <a-radio value="personal">个人作业</a-radio>
            <a-radio value="group">分组测试</a-radio>
            <!-- </s-space> -->
          </a-radio-group>
        </div>
      </div>

      <div class="row">
        <div class="left"><span class="title">评分方式</span></div>
        <div class="right">
          <table class="scoreMethod">
            <tr>
              <td class="grayBg title">评分方式</td>
              <td class="grayBg">
                <a-checkbox v-model:checked="teacherScore">教师评阅</a-checkbox>
                <a-popover title="看什么看？">
                  <template #content>
                    <p>有啥好看的</p>
                    <p>你说呢？</p>
                  </template>
                  <QuestionCircleFilled />
                </a-popover>
              </td>
              <td class="grayBg">
                <a-checkbox v-model:checked="studentScore">学生互评</a-checkbox>
                <a-popover title="看什么看？">
                  <template #content>
                    <p>有啥好看的</p>
                    <p>你说呢？</p>
                  </template>
                  <QuestionCircleFilled />
                </a-popover>
              </td>
            </tr>
            <tr>
              <td class="grayBg title">成绩占比</td>
              <td>
                <a-input-number
                  v-model:value="teacherScorePercent"
                  :min="0"
                  :max="100"
                  :formatter="(value: string) => `${value}%`"
                  :parser="(value: string) => value.replace('%', '')"
                />
              </td>
              <td>
                <a-input-number
                  v-model:value="studentScorePercent"
                  :min="0"
                  :max="100"
                  :formatter="(value: string) => `${value}%`"
                  :parser="(value: string) => value.replace('%', '')"
                />
              </td>
            </tr>
            <tr>
              <td class="title grayBg">评分设置</td>
              <td></td>
              <td>
                <a-checkbox-group
                  class="flex-col gap-7"
                  v-model:value="scoreType"
                  :options="scoreTypeOptions"
                />
              </td>
            </tr>
            <tr>
              <td class="title grayBg">量规</td>
              <td colspan="2">
                <a-select
                  placeholder="请选择"
                  class="w-full text-left"
                  v-model:value="rubicValue"
                  :options="rubicOptions"
                ></a-select>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="row">
        <div class="left"><span class="title">发放</span></div>
        <div class="right">
          <div class="publishClass p-4">
            <div class="flex flex-items-center">
              <div class="title">发放班级</div>
              <div class="flex-auto">
                <a-select
                  placeholder="请选择"
                  class="w-full"
                  mode="tags"
                  v-model:value="publicClassValue"
                  :options="publicClassOptions"
                ></a-select>
              </div>
            </div>
            <div class="flex flex-items-center">
              <div class="title required">作业截止时间</div>
              <div class="flex-auto">
                <a-date-picker show-time placeholder="Select Time" />
              </div>
            </div>
            <div class="flex flex-items-center">
              <div class="title" style="font-weight: 600">学生互评设置</div>
              <div class="flex-auto"></div>
            </div>
            <div class="flex flex-items-center">
              <div class="title required">互评时间</div>
              <div class="flex-auto">
                <a-range-picker
                  :show-time="{ format: 'HH:mm' }"
                  format="YYYY-MM-DD HH:mm"
                  :placeholder="['Start Time', 'End Time']"
                >
                  <template v-slot:separator>至</template>
                </a-range-picker>
              </div>
            </div>
            <div class="flex flex-items-center">
              <div class="title required">互评份数</div>
              <div class="flex-auto flex flex-items-center gap-2">
                <a-input-number v-model:value="innerReview" :min="1" :max="8" /> 份 / 组
              </div>
            </div>
          </div>
          <div class="addOther mt-2">
            <a-space :size="8"><PlusOutlined /><span>添加</span></a-space>
          </div>
        </div>
      </div>
    </div>
    <div class="block">
      <div class="row">
        <div class="left"><span class="title">成绩比例</span></div>
        <div class="right">
          <div class="flex flex-items-center">
            <a-slider
              v-model:value="scorePercent"
              :min="0"
              :max="100"
              :step="0.1"
              style="width: 336px"
            />
            <a-input-number
              v-model:value="scorePercent"
              :min="0"
              :max="100"
              style="width: 55px; margin-left: 8px; margin-right: 5px"
            />
            %
          </div>
          <span class="tips1">(总成绩比例不能超过100%，剩余11.4%)</span>
        </div>
      </div>

      <div class="row">
        <div class="left"><span class="title">完成指标</span></div>
        <div class="right">
          <div class="flex flex-items-center">
            <a-radio-group v-model:value="completeIndicators" class="flex flex-items-baseline">
              <a-radio value="no">无</a-radio>
              <div class="ml-6">
                <div class="flex flex-items-center">
                  <a-radio value="have">有</a-radio>
                  <a-select
                    class="ml-2"
                    v-if="completeIndicators === 'have'"
                    v-model:value="completeIndicatorValue"
                    :options="completeIndicatorValueOptions"
                  />
                </div>
                <div class="tips2 position-relative" v-if="completeIndicators === 'have'">
                  设置「完成指标」后，学生需达到条件才算完成。该活动将自动纳入学习分析的完成度统计，并作为学生学习进度的分母条件
                  <span class="triangle"></span>
                </div>
              </div>
            </a-radio-group>
          </div>
        </div>
      </div>
    </div>
    <div class="block footer">
      <a-button type="primary" :loading="isLoading" @click="save">保存</a-button>
      <a-button type="default" @click="cancel">取消</a-button>
      <a-button type="primary" disabled>primary 保存 disabled</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
// import { Row as ARow, Col as ACol } from 'ant-design-vue' // Replaced by unplugin
import type { SelectProps, UploadChangeParam } from 'ant-design-vue'
import { message } from 'ant-design-vue'
import { CloseOutlined, PlusOutlined, QuestionCircleFilled } from '@ant-design/icons-vue'

const emit = defineEmits<{
  themeChanged: [value: 'light' | 'dark', event: MouseEvent]
}>()

const theme = ref<'light' | 'dark'>('light')
const themeChanged = (event: MouseEvent) => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  emit('themeChanged', theme.value, event)
}

// 分组方案
const groupValue = ref<number | undefined>(undefined)
const groupOptions = ref<SelectProps['options']>(
  new Array(100).fill(1).map((_, index) => ({
    value: index,
    label: `分组${index + 1}`
  }))
)

const groupFilterOption = (input: string, option: { label: string }) => {
  console.log(option)
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 标题
const homeworkTitle = ref('')

// 作业附件
const fileList = ref([])
const loading = ref<boolean>(false)
const imageUrl = ref<string>('')
const getBase64 = (img: Blob, callback: (base64Url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    loading.value = true
    return
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj!, (base64Url: string) => {
      imageUrl.value = base64Url
      loading.value = false
    })
  }
  if (info.file.status === 'error') {
    loading.value = false
    message.error('upload error')
  }
}
const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

// 作业形式
const homeworkType = ref('personal')
const scoreType = ref([])
const scoreTypeOptions = ['匿名评分', '仅提交作业才可参与', '未完成互评扣分']
const teacherScore = ref(true)
const studentScore = ref(true)
const teacherScorePercent = ref(0)
const studentScorePercent = ref(0)
const rubicValue = ref<number | undefined>(undefined)
const rubicOptions = ref<SelectProps['options']>(
  new Array(5).fill(1).map((_, index) => ({
    value: index,
    label: `量规${index + 1}`
  }))
)

const publicClassValue = ref<number | undefined>(undefined)
const publicClassOptions = ref<SelectProps['options']>(
  new Array(8).fill(1).map((_, index) => ({
    value: index,
    label: `小${index + 1}班`
  }))
)

const innerReview = ref(0)
const scorePercent = ref(0)
const completeIndicators = ref('no')

const completeIndicatorValue = ref<string>('test1')
const completeIndicatorValueOptions = ref<SelectProps['options']>([
  {
    value: 'test1',
    label: `完成作业`
  },
  {
    value: 'test2',
    label: `达到60份`
  },
  {
    value: 'test3',
    label: `达到80分`
  }
])

const isLoading = ref(false)

const save = () => {
  isLoading.value = true
}

const cancel = () => {
  isLoading.value = false
}
</script>

<style scoped>
.main {
  background: var(--color-background);

  .block {
    font-size: 14px;
    display: flex;
    padding: 24px 32px;
    align-items: flex-start;
    gap: 24px;
    align-self: stretch;
    flex-direction: column;

    border-bottom: 1px solid var(--color-border);

    .title {
      font-weight: 400;
      line-height: 22px;

      &.required {
        &::before {
          content: '*';
          color: var(--dangerColor);
          margin-right: 6px;
        }
      }
    }
  }

  .header,
  .footer {
    flex-direction: row;
  }

  .header {
    color: var(--color-text3);
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    & svg {
      font-size: 18px;
      color: var(--color-text4);
    }
  }

  .footer {
    justify-content: center;
    border-bottom: none;
  }
}

.row {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 24px;

  .left {
    width: 100px;
    margin-right: 32px;
  }

  .right {
    flex: 1;
  }
}

.ant-radio-wrapper {
  margin-inline-end: 0;
  &:not(:last-of-type) {
    margin-inline-end: 32px;
  }
}

.fileUpload {
  display: flex;
  width: 200px;
  height: 64px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  border: 1px solid var(--color-border2);
  background: var(--color-background2);
  cursor: pointer;

  > span {
    pointer-events: none;
  }
}

.addOther {
  color: #20bec8;
  font-size: 14px;
  font-weight: 600;
}

.scoreMethod {
  border-collapse: collapse;
  width: 488px;
  border-radius: 4px;
  border: 1px solid var(--color-border2);
  background: var(--color-background);

  & tr,
  th,
  td {
    border: 1px solid var(--color-border2);
    padding: 16px;
    align-items: flex-start;
    justify-content: center;
  }

  .grayBg {
    background: var(--color-background3);
  }

  & td {
    text-align: left;
    vertical-align: top;
  }

  .title {
    text-align: center;
  }
}

.publishClass {
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 24px;

  .title {
    width: 128px;
    margin-right: 24px;
  }
}

.ant-input-number-input-wrap input {
  padding: 0 8px;
}

.tips1 {
  color: var(--color-text2);
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
}

.tips2 {
  padding: 12px;
  border-radius: 3px;
  background: var(--color-background4);
  display: flex;
  width: 279px;
  margin-top: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: var(--color-background5);
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;

  .triangle {
    &::before {
      content: '';
      width: 0;
      height: 0;
      border-width: 0 6px 6px;
      border-style: solid;
      border-color: transparent transparent var(--color-background4);
      position: absolute;
      left: 24px;
      top: -6px;
    }
  }
}
</style>
